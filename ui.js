import { initEditor } from "./src/renderer/editor.js";
import { initSidebar } from "./src/renderer/sidebar.js";
import { openProject, newFile, saveFile, deleteFile } from "./src/renderer/project.js";
import { initStatusBar } from "./src/renderer/statusbar.js";
import { initMenu } from "./src/renderer/menu.js";



document.addEventListener("DOMContentLoaded", () => {
  let currentFile = null;
  let currentFolder = null;
  let autosaveTimer = null;
  let isDirty = false;

  const fileList = document.getElementById("fileList");
  const status = document.getElementById("status");
  const currentProjectDisplay = document.getElementById("currentProjectSidebar");
  const currentFileDisplay = document.getElementById("currentFile");
  const sidebar = document.getElementById("sidebar");
  const editorContainer = document.getElementById("editorContainer");

  console.log("UI loaded");

  initEditor();
  initSidebar();
  initStatusBar();
  initMenu({openProject, newFile, saveFile, deleteFile});





});
