import React, { useEffect, useState } from 'react';
import './styles/App.css';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import useVoiceCapture from './hooks/useVoiceCapture';
import { getAIResponse } from '../utils/aiBackend';
import { MicrophoneIcon, StopIcon } from './components/Icons';
import { Rnd } from 'react-rnd'; 



const App: React.FC = () => {
    const handleMinimize = () => {
        window.api.minimizeWindow();
    };

    const handleMaximize = () => {
        window.api.maximizeWindow();
    };

    const handleClose = () => {
        window.api.closeWindow();
    };


    const [aiResponse, setAiResponse] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');


    useEffect(() => {
        const getAudioDevices = async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const inputDevices = devices.filter(device => device.kind === 'audioinput');
            setAudioDevices(inputDevices);
            if (inputDevices.length > 0) {
              setSelectedDeviceId(inputDevices[0].deviceId);
            }
          } catch (error) {
            console.error('Error getting audio devices:', error);
          }
        };
    
        getAudioDevices();
      }, []);

      const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(event.target.value);
      };

    const handleToggleRecording = async () => {
        if (isRecording) {
          await window.api.stopVoiceCapture();
          setIsRecording(false);
        } else {
          const selectedDevice = audioDevices.find(d => d.deviceId === selectedDeviceId);
          if (!selectedDevice) {
            alert('Please select an audio device.');
            return;
          }
    
          await window.api.startVoiceCapture(selectedDevice.label);
          setTranscription('');
          setIsRecording(true);
        }
    };

    const getLastSentence = (text: string) => {
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        return sentences?.[sentences.length - 1]?.trim() || text;
    };
    
    useEffect(() => {
        window.api.onTranscription((data: string) => {
          setTranscription((prev) => prev + '\n' + data);
        });
      
        window.api.onAIResponse((response: string) => {
          console.log('Received AI Response in renderer:', response);
          setAiResponse(response);
        });
      }, []);
      

    
    return (

       

        <Rnd
            default={{
                x: 100,
                y: 100,
                width: 800,
                height: 600,
            }}
            minWidth={400}
            minHeight={300}
            bounds="window"
            enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
            }}
            dragHandleClassName="window-header"
        >
        <div className="app">
                {/* Header */}
                <div className="window-header bg-gray-800 text-white p-1 flex justify-between items-center cursor-move">
                    <div className="title text-sm font-semibold">Ush</div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="audioDevice" className="text-xs font-medium">
                            Audio Device:
                        </label>
                        <select
                            id="audioDevice"
                            onChange={handleDeviceChange}
                            className="text-xs p-1 rounded bg-gray-700 text-white"
                            style={{ width: '150px' }}
                        >
                            <option value="">Select a device</option>
                            {audioDevices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Device ${device.deviceId}`}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleToggleRecording}
                            className={`p-2 rounded-full shadow-lg ${
                                isRecording ? 'bg-pink-500 hover:bg-pink-600' : 'bg-blue-500 hover:bg-blue-600'
                            } transition-all`}
                            title={isRecording ? 'Stop Recording' : 'Start Recording'}
                        >
                            {isRecording ? (
                                <MicrophoneIcon className="w-4 h-4 text-white" />
                            ) : (
                                
                                <StopIcon className="w-4 h-4 text-white" />
                            )}
                        </button>
                    </div>
                    <div className="window-controls flex space-x-2">
                        <button onClick={handleMinimize} className="text-xs">
                            _
                        </button>
                        <button onClick={handleMaximize} className="text-xs">
                            □
                        </button>
                        <button onClick={handleClose} className="text-xs">
                            ×
                        </button>
                    </div>
                </div>

                {/* Panels */}
                <div className="grid grid-cols-2 gap-6 mt-2 w-full h-full overflow-hidden">
                    {/* Transcription Panel */}
                    <div className="panel flex flex-col h-full overflow-hidden">
                        <h2 className="text-lg font-semibold mb-2">Real-Time Transcription</h2>
                        <div className="flex-1 overflow-y-auto p-2 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm text-gray-300">{transcription || 'No transcription available.'}</p>
                        </div>
                    </div>

                    {/* AI Response Panel */}
                    <div className="panel flex flex-col h-full overflow-hidden">
                        <h2 className="text-lg font-semibold mb-2">AI Response</h2>
                        <div className="flex-1 overflow-y-auto p-2 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm text-gray-300">{aiResponse || 'No response from AI yet.'}</p>
                        </div>
                    </div>
                </div>
            </div>
     
        
        </Rnd>
        
    );
};

export default App;