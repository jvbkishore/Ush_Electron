# AI Meeting Assistant

## Overview
The AI Meeting Assistant is a desktop application built with Electron and React that captures voice during meetings, transcribes it in real-time, and interacts with an AI backend to provide intelligent responses and insights.

## Features
- Real-time voice capture and transcription
- Interaction with an AI backend for enhanced meeting insights
- User-friendly interface built with React
- Cross-platform compatibility

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-meeting-assistant.git
   ```

2. Navigate to the project directory:
   ```
   cd ai-meeting-assistant
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. The application will open a window where you can begin capturing voice for transcription.

## Development

- The main process is located in `src/main/main.ts`.
- The preload script can be found in `src/main/preload.ts`.
- The React components are in the `src/renderer` directory.
- Custom hooks for voice capture are located in `src/renderer/hooks/useVoiceCapture.ts`.
- Utility functions for AI interactions are in `src/utils/aiBackend.ts`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.



##steps to setup local
1. npm install (in root folder location) after taking clone
2. Download ffmpeg-release-essentials from https://www.gyan.dev/ffmpeg/builds/#release-builds
3. Extract and place bin folder from it into C:/ffmpeg and add C:/ffmpeg/bin into Environment variable - path variable
4. run cmd and exectue ffmpeg --version to verify the installation of ffmpeg
5. take and place whisper bin folder  in whisper.cpp (its build of whisper code)
6. Downlaod  ggml-base.en.bin (148 mb) model from https://huggingface.co/ggerganov/whisper.cpp/tree/main and place it in ../whisper.cpp/models (main.ts - line 30/31)
  
