import { initEditor } from "./components/editor.js";
import { initSidebar } from "./components/sidebar.js";
import { openProject, newFile, saveFile, deleteFile, initProject } from "./components/project.js";
import { initStatusBar } from "./components/statusbar.js";
import { initMenu } from "./components/menu.js";



document.addEventListener("DOMContentLoaded", () => {
  console.log("UI loaded");

  initEditor();
  initSidebar();
  initStatusBar();
  initMenu({openProject, newFile, saveFile, deleteFile});
  initProject();

});
