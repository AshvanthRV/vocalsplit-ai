let electron = require("electron");
let path = require("path");
let _electron_toolkit_utils = require("@electron-toolkit/utils");

// Application icon
var icon_default = (0, path.join)(
  __dirname,
  "../../resources/icon.png"
);

// Create application window
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,

    ...(process.platform === "linux"
      ? { icon: icon_default }
      : {}),

    webPreferences: {
      preload: (0, path.join)(
        __dirname,
        "../preload/index.js"
      ),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (
    _electron_toolkit_utils.is.dev &&
    process.env["ELECTRON_RENDERER_URL"]
  ) {
    mainWindow.loadURL(
      process.env["ELECTRON_RENDERER_URL"]
    );
  } else {
    mainWindow.loadFile(
      (0, path.join)(
        __dirname,
        "../renderer/index.html"
      )
    );
  }
}

// Application initialization
electron.app.whenReady().then(() => {
  _electron_toolkit_utils.electronApp.setAppUserModelId(
    "com.electron"
  );

  electron.app.on(
    "browser-window-created",
    (_, window) => {
      _electron_toolkit_utils.optimizer.watchWindowShortcuts(
        window
      );
    }
  );

  // 1. Native audio-file selection dialog
  electron.ipcMain.handle(
    "dialog:selectAudioFile",
    async () => {
      const result = await electron.dialog.showOpenDialog({
        title: "Select an audio file",
        properties: ["openFile"],
        filters: [
          {
            name: "Audio Files",
            extensions: [
              "wav",
              "mp3",
              "flac",
              "aac",
              "m4a",
            ],
          },
        ],
      });

      if (
        result.canceled ||
        result.filePaths.length === 0
      ) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  // 2. Native output-folder selection dialog
  electron.ipcMain.handle(
    "dialog:selectOutputFolder",
    async () => {
      const result = await electron.dialog.showOpenDialog({
        title: "Choose Output Folder",
        buttonLabel: "Select Folder",
        properties: [
          "openDirectory",
          "createDirectory",
        ],
      });

      if (
        result.canceled ||
        result.filePaths.length === 0
      ) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  createWindow();

  electron.app.on("activate", function () {
    if (
      electron.BrowserWindow.getAllWindows().length === 0
    ) {
      createWindow();
    }
  });
});

// Close application
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});