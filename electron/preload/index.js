const { contextBridge, ipcRenderer } = require('electron')

const api = {
  selectAudioFile: () => ipcRenderer.invoke('dialog:selectAudioFile')
}

contextBridge.exposeInMainWorld('api', api)