let electron = require("electron");
let _electron_toolkit_preload = require("@electron-toolkit/preload");
// src/preload/index.ts
var api = {};
if (process.contextIsolated) try {
	electron.contextBridge.exposeInMainWorld("electron", _electron_toolkit_preload.electronAPI);
	electron.contextBridge.exposeInMainWorld("api", api);
} catch (error) {
	console.error(error);
}
else {
	window.electron = _electron_toolkit_preload.electronAPI;
	window.api = api;
}
