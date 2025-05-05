import { useEffect, useRef, useState } from 'react';

const useVoiceCapture = () => {
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

    // Enumerate available audio devices
    const getAudioDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
            setAudioDevices(audioOutputDevices);
        } catch (err) {
            console.error('Error enumerating audio devices:', err);
        }
    };

    // Start recording from the selected device
    const startRecording = async () => {
        if (!selectedDeviceId) {
            console.error('No audio device selected.');
            return;
        }

        try {
            console.log('Starting audio capture from device:', selectedDeviceId);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedDeviceId,
                },
            });

            // Send the audio stream to Whisper.cpp for transcription
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);

            // Process the audio stream (e.g., send to Whisper.cpp)
            console.log('Audio stream started...');
            // TODO: Add logic to send audio to Whisper.cpp for transcription
        } catch (err) {
            console.error('Error starting audio capture:', err);
        }
    };

    // Stop recording
    const stopRecording = () => {
        console.log('Stopping audio capture...');
        // TODO: Stop the audio stream and clean up resources
    };

    return {
        audioDevices,
        getAudioDevices,
        startRecording,
        stopRecording,
        setSelectedDeviceId,
    };
};

export default useVoiceCapture;


//Mic from local code start 
// const useVoiceCapture = () => {
//     const [transcription, setTranscription] = useState('');
//     const [isRecording, setIsRecording] = useState(false);
//     const [error, setError] = useState<string | null>(null); // Tracks errors

    
//     const startRecording = async () => {
//         try {
//             console.log('Starting microphone recording...useVoicecapture code');
//             setTranscription('');
//             console.log('initating api call');
            
//             try{
//             await window.api.startVoiceCapture();
//             } catch (err) {
//                 console.error('Error starting voice capture:', err);
//                 setError('Error starting voice capture. voice capturre');      
//             }
           
//             setIsRecording(true);

           
//         } catch (err) {
//             console.error('Error starting recording:', err);
//             setError('Error starting recording.');
//         }
//     };


//     const stopRecording = async() => {
//         try {
//             console.log('Stopping microphone recording...');
//             await window.api.stopVoiceCapture();
//             setIsRecording(false);
//             console.log('Recording stopped...');
//         } catch (err) {
//             console.error('Error stopping recording:', err);
//             setError('Error stopping recording.');
//         }
//     };



//     useEffect(() => {
//         window.api.onTranscription((text) => {
//             setTranscription((prev) => prev + text);
//         });
//     }, []);


//     return { transcription, isRecording, startRecording, stopRecording ,error};
// };

// export default useVoiceCapture;

//end mic from local code
