import { openProject, newFile, saveFile, deleteFile, isDirty } from './project.js';

export function initMenu() {
  const fileMenu = document.getElementById("fileMenu");
  fileMenu.addEventListener("click", () => fileMenu.classList.toggle("show"));

  document.addEventListener("click", (e) => {
    if (!fileMenu.contains(e.target)) fileMenu.classList.remove("show");
  });

  document.getElementById("newProject").addEventListener("click", async () => {
    const folder = await window.api.createNewProject();
    if (folder) openProject(folder);
  });

  document.getElementById("openProject").addEventListener("click", async () => {
    const folder = await window.api.openProject();
    if (folder) openProject(folder);
  });

  document.getElementById("newFile").addEventListener("click", newFile);
  document.getElementById("saveFile").addEventListener("click", saveFile);
  document.getElementById("deleteFile").addEventListener("click", deleteFile);
  document.getElementById("quitMenu").addEventListener("click", () => window.close());

  // ---------------- IPC listeners ----------------
  window.api.on("menu-open-project", openProject);
  window.api.on("menu-new-file", newFile);
  window.api.on("menu-save-file", saveFile);
  window.api.on("menu-delete-file", deleteFile);

  window.addEventListener("beforeunload", (e) => {
    if (isDirty) {
      e.returnValue = "You have unsaved changes. Are you sure you want to quit?";
      return e.returnValue;
    }
  });
}