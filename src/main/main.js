const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron/main");
const { shell, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const linguist = require("linguist-js");
const fs = require("original-fs");
const fs_promises = require("original-fs").promises;
const path = require("node:path");

let mainWindow;
let tray;
const gotTheLock = app.requestSingleInstanceLock();

const iconPath = path.join(app.getAppPath(), "assets/logo.ico");
const img = nativeImage.createFromPath(iconPath);

Object.defineProperty(app, "isPackaged", {
    get() {
        return true;
    },
});

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 700,
        frame: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        icon: img,
        webPreferences: {
            devTools: false,
            zoomFactor: 1.0,
            preload: path.join(app.getAppPath(), "src/preload/preload.js")
        }
    });

    mainWindow.loadFile(path.join(app.getAppPath(), "src/renderer/index.html"));
}

const exec = require("child_process").exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
}

if (!gotTheLock) {
    app.quit();
}
else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.send("reset-scroll");
        }
    });

    app.whenReady().then(() => {
        createWindow();

        mainWindow.on("show", () => {
            mainWindow.webContents.zoomFactor = 1.0;
            mainWindow.webContents.send("reset-scroll");
        });

        autoUpdater.on("update-available", (event) => {
            const dialogOpts = {
                type: "info",
                buttons: ["Download now", "Remind me later"],
                title: "Space Updater",
                detail: "A new version is available."
            }

            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    autoUpdater.downloadUpdate();
                }
            });
        });

        autoUpdater.on("update-downloaded", (event) => {
            const dialogOpts = {
                type: "info",
                buttons: ["Install now", "Install later"],
                title: "Space Updater",
                detail: "A new version has been downloaded. Restart the application to apply the updates."
            }

            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    autoUpdater.quitAndInstall(isSilent = false, isForceRunAfter = true);
                    mainWindow.destroy();
                }
            });
        });

        autoUpdater.autoDownload = false;
        autoUpdater.checkForUpdates();

        mainWindow.on("close", function (event) {
            event.preventDefault();
            mainWindow.hide();
        });

        tray = new Tray(img);

        const contextMenu = Menu.buildFromTemplate([
            { label: `Space (v${app.getVersion()})`, type: "normal", enabled: false, icon: img.resize({ width: 16, height: 16 }) },
            { type: "separator" },
            { label: "Show", type: "normal", click: function () { mainWindow.show(); } },
            { label: "Check for updates", type: "normal", click: function () { autoUpdater.checkForUpdates(); } },
            { type: "separator" },
            { label: "Quit Space", type: "normal", click: function () { mainWindow.destroy(); app.quit(); } }
        ]);

        tray.setToolTip(`Space (v${app.getVersion()})`);

        tray.setContextMenu(contextMenu);

        tray.on("click", () => {
            mainWindow.show();
        });

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });

        ipcMain.handle("createSpaceFolder", async (event) => {
            try {
                const parentFolderPath = path.join(app.getPath("appData"), "space", "spaces");

                if (!fs.existsSync(parentFolderPath)) {
                    await fs.promises.mkdir(parentFolderPath, { recursive: true });
                }

                return true;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        ipcMain.handle("getSpaces", async (event) => {
            const spacesPath = path.join(app.getPath("appData"), "space", "spaces");

            try {
                const files = await fs.promises.readdir(spacesPath);
                const folders = files.filter((name) => fs.statSync(path.join(spacesPath, name)).isDirectory());
                return folders;
            } catch (error) {
                console.error(error);
                throw error;
            };
        });

        ipcMain.handle("openSpacesFolder", async (event) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces");
            shell.openPath(folderPath);
        });

        ipcMain.handle("openSpaceFolder", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);
            shell.openPath(folderPath);
        });

        ipcMain.handle("createSpace", async (event, name) => {
            try {
                const folderPath = path.join(app.getPath("appData"), "space", "spaces", name.replace(/ /g, "-"));
                await fs_promises.mkdir(folderPath);
                return true;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        ipcMain.handle("deleteSpace", async (event, name) => {
            try {
                const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);

                await deleteRecursiveFolder(folderPath);

                return true;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        const deleteRecursiveFolder = async (folderPath) => {
            const files = await fs.promises.readdir(folderPath);

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                const stats = await fs.promises.stat(filePath);

                if (stats.isDirectory()) {
                    await deleteRecursiveFolder(filePath);
                } else {
                    await fs.promises.unlink(filePath);
                }
            }

            await fs.promises.rmdir(folderPath);
        }

        ipcMain.handle("codeSpace", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name.replace(/ /g, "-"));
            execute("code " + folderPath, (output) => {
                return output;
            });
        });

        ipcMain.handle("renameSpace", async (event, old_name, new_name) => {
            const oldFolderPath = path.join(app.getPath("appData"), "space", "spaces", old_name);
            const newFolderPath = path.join(app.getPath("appData"), "space", "spaces", new_name);

            fs.rename(oldFolderPath, newFolderPath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });

        ipcMain.handle("openTerminal", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);
            execute(`start "" /D "${folderPath}"`, (output) => {
                return output;
            });
        });

        ipcMain.handle("getSpaceWeight", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);

            return new Promise((resolve, reject) => {
                exec(`powershell -command "$totalsize=[long]0;gci -File '${folderPath}' -r -fo -ea Silent|%{$totalsize+=$_.Length};$totalsize"`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        reject(stderr);
                        return;
                    }
                    resolve(stdout.trim());
                });
            });
        });

        ipcMain.handle("getGithubRepo", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);

            return new Promise((resolve, reject) => {
                exec("git config --get remote.origin.url", { cwd: folderPath }, (error, stdout, stderr) => {
                    if (error) {
                        resolve("Git repository not found");
                        return;
                    }
                    if (stderr) {
                        resolve("Git repository not found");
                        return;
                    }
                    resolve(stdout.trim());
                });
            });
        });

        ipcMain.handle("getGithubBranch", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);

            return new Promise((resolve, reject) => {
                exec("git rev-parse --abbrev-ref HEAD", { cwd: folderPath }, (error, stdout, stderr) => {
                    if (error) {
                        resolve("Git repository not found");
                        return;
                    }
                    if (stderr) {
                        resolve("Git repository not found");
                        return;
                    }
                    resolve(stdout.trim());
                });
            });
        });

        ipcMain.handle("openExternalURL", (event, url) => {
            shell.openExternal(url);
        });

        ipcMain.handle("getGitStats", async (event, name) => {
            const folderPath = path.join(app.getPath("appData"), "space", "spaces", name);
            const result = await linguist(folderPath);

            return result;
        });

        ipcMain.handle("quit", (event) => {
            app.quit();
        });

        ipcMain.handle("minimize", (event) => {
            mainWindow.minimize();
        });
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});