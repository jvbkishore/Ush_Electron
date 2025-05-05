import { app, BrowserWindow, ipcMain,Tray, Menu, Notification} from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
const recordModule = require('node-record-lpcm16');
const record = recordModule.default || recordModule;
import { getAIResponse } from '../utils/aiBackend';


let ffmpegProcess: any = null;
let mainWindow: Electron.BrowserWindow | null = null;
let tray: Tray | null = null;
let selectedDeviceId: string | null = null;


const soxPath = "C:\\Program Files (x86)\\sox-14-4-2\\sox.exe";
const ffmpegPath = "C:\\ffmpeg\\bin\\ffmpeg.exe"; // Example path — change to actual



// Check if the Sox executable is available
if (fs.existsSync(soxPath)) {
    console.log('Sox is available at:', soxPath);
} else {
    console.error('Sox not found at the specified path:', soxPath);
}

const audioFilePath = path.join(app.getPath('userData'), 'temp_audio.wav');
const processedAudioFilePath = path.join(app.getPath('userData'), 'processed_audio.wav');// Processed audio file
const whisperBinary = path.join(__dirname, '../whisper.cpp/build/bin/Release/whisper-cli.exe');
const modelPath = path.join(__dirname, '../whisper.cpp/models/ggml-base.en.bin');



const sendToAI = async (text: string) => {
    try {
        console.log('Calling SendAI method:', text);
       // const latest = getLastSentence(text);
        const response_ai = await getAIResponse(text);
        if (response_ai !== undefined && response_ai !== null) {
            console.log('AI response:', response_ai);
            mainWindow?.webContents.send('aiResponse', response_ai.toString());
            
        } else {
            console.warn('AI response was undefined or null');
            mainWindow?.webContents.send('aiResponse', 'No response from AI.');
            
        }
    } catch (error) {
        console.error('Failed to get AI response:', error);
    }
};



function startRecording() {
    // Logic to start the recording
    console.log("Recording started...");
    // Example: call your start-voice-capture ipc event
    mainWindow?.webContents.send('start-voice-capture', selectedDeviceId);
}

function stopRecording() {
    // Logic to stop the recording
    console.log("Recording stopped...");
    // Example: call your stop-voice-capture ipc event
    mainWindow?.webContents.send('stop-voice-capture');
}

// Function to run Whisper.cpp for transcription
function runWhisper(resolve: () => void, reject: (err: Error) => void) {
    const whisperProcess = spawn(whisperBinary, ['-m', modelPath, '-f', processedAudioFilePath]);
    let fullOutput = '';
    whisperProcess.stdout.on('data', (data) => {
        const text = data.toString();
        console.log('Whisper output:', text);
        
        mainWindow?.webContents.send('transcription', text);
        fullOutput += text;
        
        
    });

    whisperProcess.stderr.on('data', (data) => {
        console.error('Whisper error:', data.toString());
    });

    whisperProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Whisper process completed successfully.');

            // Clean transcription text
            const cleanedText = fullOutput
            .replace(/\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]/g, '') // Remove timestamps
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim(); // Remove leading/trailing whitespace

                    
            if (!cleanedText) {
                console.warn('Transcription is empty after cleaning, skipping AI call.');
                mainWindow?.webContents.send('aiResponse', 'No valid transcription available.');
                resolve(); // Prevent app from hanging
                return;
            }

            console.log('Full transcription output:', cleanedText);
            console.log ('calling AI from Main');
            resolve();
            sendToAI(cleanedText);
          
        } else {
            console.error(`Whisper process exited with code ${code}`);
            reject(new Error(`Whisper process failed with code ${code}`));
        }
    });
}





ipcMain.on('minimize-window', () => {
    mainWindow?.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});

ipcMain.on('close-window', () => {
    mainWindow?.close();
});



app.on('ready', () => {
   
    tray = new Tray(path.join(__dirname, 'resources', 'icon.png'));
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Start Recording',
            click: () => startRecording(),
        },
        {
            label: 'Stop Recording',
            click: () => stopRecording(),
        },
        {
            label: 'Quit',
            click: () => app.quit(),
        },
    ]);
    tray.setContextMenu(trayMenu);
    tray.setToolTip('Ush - AI Meeting Assistant');


    ipcMain.handle('start-voice-capture', async (_, deviceId: string) => {
        try{
            selectedDeviceId = deviceId; 
            console.log('Selected device ID:', selectedDeviceId);
            console.log('Starting FFmpeg recording...');
             if (fs.existsSync(audioFilePath)) {
                fs.unlinkSync(audioFilePath); // remove if exists
            } 

            ffmpegProcess = spawn(ffmpegPath, [
                '-f', 'dshow',
                '-i', `audio=${selectedDeviceId}`, // <=== change this if your mic name is different
                '-ac', '1',
                '-ar', '16000',
                '-t', '3600', // Max duration fallback (1 hour)
                '-y', audioFilePath
            ], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
    
            ffmpegProcess.stderr.on('data', (data: Buffer) => {
                console.log(`[ffmpeg stderr] ${data}`);
            });
    
            ffmpegProcess.on('close', (code: number) => {
                console.log(`FFmpeg recording stopped with code ${code}`);
            });
    
            console.log('FFmpeg microphone recording started...');


        
        } catch (err: any) {
            console.error('FULL ERROR STACK:', err);
            //console.error('Error starting voice capture:', err);
            throw new Error(`Failed to start voice capture: ${err?.message || err}`);
        }
    });

    ipcMain.handle('stop-voice-capture', async () => {

        try {
            console.log('Stopping FFmpeg recording...');
            return new Promise<void>((resolve, reject) => {
                if (ffmpegProcess) {
                    ffmpegProcess.on('close', (code: number) => {
                        console.log(`FFmpeg recording stopped with code ${code}`);
                        console.log('Recording stopped. Audio saved to:', audioFilePath);
    
                        try {
                            fs.copyFileSync(audioFilePath, processedAudioFilePath);
                            runWhisper(resolve, reject);
                        } catch (copyErr) {
                            console.error('Error during file copy or Whisper:', copyErr);
                            reject(copyErr);
                        } finally {
                            ffmpegProcess = null;
                        }
                    });
    
                    ffmpegProcess.stdin.write('q\n');
    
                    setTimeout(() => {
                        if (ffmpegProcess) {
                            console.log('Force killing FFmpeg due to timeout.');
                            ffmpegProcess.kill();
                        }
                    }, 3000);
                } else {
                    reject(new Error('FFmpeg process not running.'));
                }
            });
            
            
        } catch (err) {
            console.error('Error stopping voice capture:', err);
            throw new Error('Failed to stop voice capture.');
        }
    });
    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true, // Makes the window transparent
        frame: false,
        acceptFirstMouse: true, 
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
        type: 'tool', 
        webPreferences: {
            preload: path.join(__dirname, 'preload.bundle.js'),
            contextIsolation: true,
            nodeIntegration: false,
           
            sandbox: false,
        },
    });
    
    if (mainWindow) {
        
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
        mainWindow.setIgnoreMouseEvents(false, { forward: true });

      
        tray.on('click', () => {
            if (mainWindow?.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow?.show();
            }
        });
    }

    


 
});




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// Handle device list update
ipcMain.handle('get-audio-input-devices', async () => {
    const devices = await getInputDeviceById(); // Helper to fetch available audio input devices
    return devices;
  });


export async function getInputDeviceById(): Promise<string[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput').map(device => device.deviceId);
}
