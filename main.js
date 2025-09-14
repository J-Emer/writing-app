const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

let win;

const defaultProjectFolder = path.join(os.homedir(), "MyWritingApp");

// Ensure default folder exists
if (!fs.existsSync(defaultProjectFolder)) {
  fs.mkdirSync(defaultProjectFolder, { recursive: true });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      spellcheck: true,
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools();
  win.maximize();
  win.setMenu(null);
}


// --------------------
// IPC Handlers
// --------------------
ipcMain.handle("list-files", async (_, folder) => {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter((f) => fs.lstatSync(path.join(folder, f)).isFile());
});

ipcMain.handle("read-file", async (_, filePath) => fs.readFileSync(filePath, "utf-8"));

ipcMain.handle("write-file", async (_, filePath, content) => {
  fs.writeFileSync(filePath, content, "utf-8");
});

ipcMain.handle("delete-file", async (_, filePath) => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

ipcMain.handle("create-file-dialog", async (_, folder) => {
  if (!folder) return null;
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: "New File",
    defaultPath: path.join(folder, "untitled.md"),
    filters: [{ name: "Markdown & Text", extensions: ["md", "txt"] }],
  });

  if (canceled || !filePath) return null;
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "");
  return filePath;
});

ipcMain.handle("open-project", async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: "Select Project Folder",
    defaultPath: defaultProjectFolder,
    properties: ["openDirectory"],
  });
  if (canceled || !filePaths || !filePaths[0]) return null;
  return filePaths[0];
});

ipcMain.handle("create-new-project", async () => {
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: "New Project Name",
    defaultPath: defaultProjectFolder,
    buttonLabel: "Create Project",
    properties: ["createDirectory"]
  });

  if (!canceled && filePath) {
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
    return filePath; // return the folder path to renderer
  }
  return null;
});



app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("web-contents-created", (event, contents) => {
  contents.on("context-menu", (e, params) => {
    const menu = Menu.buildFromTemplate([
      ...(params.misspelledWord ? [
        { label: params.misspelledWord, enabled: false },
        ...params.dictionarySuggestions.map(s => ({
          label: s,
          click: () => contents.replaceMisspelling(s),
        })),
        { type: "separator" },
        { label: "Add to Dictionary", click: () => contents.addWordToSpellCheckerDictionary(params.misspelledWord) },
      ] : []),
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      { role: "selectAll" },
    ]);
    menu.popup();
  });
});

