import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

interface TranscribeResponse {
  text: string;
}

// Whisper specific APIs
const whisperAPI = {
  onTranscriptionResponse: (callback: (data: TranscribeResponse) => void) => {
    electronAPI.ipcRenderer.on("transcription-response", (_, data) =>
      callback(data)
    );
  },

  removeTranscriptionResponseListener: () => {
    electronAPI.ipcRenderer.removeAllListeners("transcription-response");
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("whisperAPI", whisperAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.whisperAPI = whisperAPI;
}
