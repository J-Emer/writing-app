const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  createNewProject: () => ipcRenderer.invoke("create-new-project"),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke("write-file", filePath, content),
  openProject: () => ipcRenderer.invoke("open-project"),
  listFiles: (folder) => ipcRenderer.invoke("list-files", folder),
  deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),
  createFileDialog: (folder) => ipcRenderer.invoke("create-file-dialog", folder),

  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
});
