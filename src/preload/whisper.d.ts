import { ElectronAPI } from "@electron-toolkit/preload";


interface WhisperAPI {}

declare global {
  interface Window {
    electron: ElectronAPI;
    whisperAPI: WhisperAPI;
  }
}
