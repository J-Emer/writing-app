const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  createNewProject: () => ipcRenderer.invoke("create-new-project"),
  openProject: () => ipcRenderer.invoke("open-project"),
  listFiles: (folder) => ipcRenderer.invoke("list-files", folder),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke("write-file", filePath, content),
  deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),
  createFileDialog: (folder) => ipcRenderer.invoke("create-file-dialog", folder),
  on: (channel, callback) => ipcRenderer.on(channel, (event, data) => callback(data))
});
