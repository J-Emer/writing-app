import { initEditor } from './editor.js';
import { openProject, saveFile } from './project.js';
import { initSidebar } from './sidebar.js';
import { updateStatus } from './statusbar.js';

document.addEventListener("DOMContentLoaded", () => {
  const quill = initEditor();
  initSidebar();

  // Example usage:
  updateStatus("Ready");
});
