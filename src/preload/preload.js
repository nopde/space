const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("electronAPI", {
    createSpaceFolder: () => ipcRenderer.invoke("createSpaceFolder"),
    getSpaces: () => ipcRenderer.invoke("getSpaces"),
    createSpace: (name) => ipcRenderer.invoke("createSpace", name),
    deleteSpace: (name) => ipcRenderer.invoke("deleteSpace", name),
    openSpaceFolder: (name) => ipcRenderer.invoke("openSpaceFolder", name),
    openSpacesFolder: () => ipcRenderer.invoke("openSpacesFolder"),
    codeSpace: (name) => ipcRenderer.invoke("codeSpace", name),
    renameSpace: (old_name, new_name) => ipcRenderer.invoke("renameSpace", old_name, new_name),
    openTerminal: (name) => ipcRenderer.invoke("openTerminal", name),
    getSpaceWeight: (name) => ipcRenderer.invoke("getSpaceWeight", name),
    getGithubRepo: (name) => ipcRenderer.invoke("getGithubRepo", name),
    getGithubBranch: (name) => ipcRenderer.invoke("getGithubBranch", name),
    openExternalURL: (url) => ipcRenderer.invoke("openExternalURL", url),
    quit: () => ipcRenderer.invoke("quit"),
    minimize: () => ipcRenderer.invoke("minimize"),
    onResetScroll: (callback) => ipcRenderer.on("reset-scroll", callback)
});