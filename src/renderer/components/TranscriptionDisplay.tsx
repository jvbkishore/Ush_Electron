import React from 'react';

interface TranscriptionDisplayProps {
    transcription: string;
    aiResponse: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, aiResponse }) => {
    return (
        <div className="transcription-display">
            <h2>Real-Time Transcription</h2>
            <p>{transcription}</p>
            <h2>AI Response</h2>
            <p>{aiResponse}</p>
        </div>
    );
};

export default TranscriptionDisplay;