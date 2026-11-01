const { contextBridge, ipcRenderer } = require('electron')

const api = {
  // Open native audio-file selection dialog
  selectAudioFile: () =>
    ipcRenderer.invoke('dialog:selectAudioFile'),

  // Open native output-folder selection dialog
  selectOutputFolder: () =>
    ipcRenderer.invoke('dialog:selectOutputFolder')
}

contextBridge.exposeInMainWorld('api', api)