import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('api', {
    
    
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),

    getAudioInputDevices: async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'audioinput');
      },

    startVoiceCapture: async (deviceId: string): Promise<void> => {
        console.log('Calling start-voice-capture in preload.ts...');
        try {
            const result = await ipcRenderer.invoke('start-voice-capture',deviceId);
            console.log('start-voice-capture result:', result);
        } catch (err) {
            console.error('Error in start-voice-capture:', err);
        }
    },
    stopVoiceCapture: (): Promise<void> => ipcRenderer.invoke('stop-voice-capture'),
    onTranscription: (callback: (data: string) => void) => {
        ipcRenderer.on('transcription', (_event, data) => {
          callback(data);
        });
      },

    // AI response event listener
    onAIResponse: (callback: (response: string) => void) => ipcRenderer.on('aiResponse', (_, data) => callback(data)),
});