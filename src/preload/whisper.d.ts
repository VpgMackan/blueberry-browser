import { ElectronAPI } from "@electron-toolkit/preload";

interface WhisperAPI {
  onTranscriptionResponse: (
    callback: (data: TranscribeResponse) => void
  ) => void;
  removeTranscriptionResponseListener: () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    whisperAPI: WhisperAPI;
  }
}
