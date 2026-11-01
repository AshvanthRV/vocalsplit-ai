/// <reference types="vite/client" />

interface Window {
  api: {
    selectAudioFile: () => Promise<string | null>
    selectOutputFolder: () => Promise<string | null>
  }
}