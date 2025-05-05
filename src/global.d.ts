// filepath: src/global.d.ts
export {};

declare global {
    interface Window {
        api: {
            
            minimizeWindow: () => void;
            maximizeWindow: () => void;
            closeWindow: () => void;
            startVoiceCapture: (label:string) => Promise<void>;
            stopVoiceCapture: () => Promise<void>;
            onTranscription: (callback: (transcription: string) => void) => void;
            onAIResponse: (callback: (response: string) => void) => void;
        };
    }
}

declare module 'node-record-lpcm16' {
    const record: any;
    export default record;
}



declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default content;
}


interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
};

declare module 'mic' {
    interface MicOptions {
        rate?: string;
        channels?: string;
        fileType?: string;
        device?: string;
        exitOnSilence?: number;
        debug?: boolean;
        endian?: string;
        bitwidth?: string;
        encoding?: string;
    }

    interface MicInstance {
        start(): void;
        stop(): void;
        pause(): void;
        resume(): void;
        getAudioStream(): NodeJS.ReadableStream;
    }

    function mic(options?: MicOptions): MicInstance;

    export = mic;
}