const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("electronAPI", {
    createSpaceFolder: () => ipcRenderer.invoke("createSpaceFolder"),
    getSpaces: () => ipcRenderer.invoke("getSpaces"),
    createSpace: (name) => ipcRenderer.invoke("createSpace", name),
    deleteSpace: (name) => ipcRenderer.invoke("deleteSpace", name),
    openSpaceFolder: (name) => ipcRenderer.invoke("openSpaceFolder", name),
    openSpacesFolder: () => ipcRenderer.invoke("openSpacesFolder"),
    codeSpace: (name) => ipcRenderer.invoke("codeSpace", name),
    quit: () => ipcRenderer.invoke("quit"),
    minimize: () => ipcRenderer.invoke("minimize"),
});