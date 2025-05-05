declare module 'node-record-lpcm16' {
    import { Writable } from 'stream';

    interface RecordOptions {
        sampleRate?: number; // Sample rate in Hz (e.g., 16000)
        channels?: number;   // Number of audio channels (e.g., 1 for mono)
        threshold?: number;  // Silence threshold
        endOnSilence?: boolean; // Stop recording on silence
        device?: string;     // Audio input device
    }

    interface Record {
        start(options?: RecordOptions): Writable;
        stop(): void;
    }

    const record: Record;
    export default record;
}