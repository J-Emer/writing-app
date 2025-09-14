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

  //console.log("UI loaded");

  //---------------Quill WYSIWYG Editor---------------------------//

  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],  // heading dropdown
        ['bold', 'italic', 'underline', 'strike'], // formatting
        ['link', 'image', 'code-block'], // links, images, code
        [{ list: 'ordered' }, { list: 'bullet' }], // lists
        [{ color: [] }, { background: [] }], // text/background color
        ['clean'] // remove formatting button
      ]
    }
  });

  const toolbar = quill.getModule('toolbar').container;

  const tooltips = {
    'ql-bold': 'Bold (Ctrl+B)',
    'ql-italic': 'Italic (Ctrl+I)',
    'ql-underline': 'Underline (Ctrl+U)',
    'ql-strike': 'Strike',
    'ql-link': 'Insert Link',
    'ql-image': 'Insert Image',
    'ql-code-block': 'Code Block',
    'ql-list': 'List',
    'ql-list-ordered': 'Ordered List',
    'ql-clean': 'Remove Formatting',
    'ql-header': 'Heading',
    'ql-color': 'Text Color',
    'ql-background': 'Background Color'
  };

  toolbar.querySelectorAll('button, select').forEach(el => {
    for (const cls in tooltips) {
      if (el.classList.contains(cls)) {
        el.setAttribute('title', tooltips[cls]);
      }
    }
  });

  quill.on('text-change', () => {
    isDirty = true;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveFile, 1000);
    updateStatusBar();
  });

  // ------------------- File/Project Functions -------------------

  function getFolderName(folderPath) {
    if (!folderPath) return "None";
    return folderPath.split(/[\\/]/).filter(Boolean).pop();
  }

  function getFileName(filePath) {
    if (!filePath) return "None";
    const name = filePath.split(/[\\/]/).pop();
    return name.replace(/\.[^/.]+$/, "");
  }
  
  async function openProject(folder) {
    currentFolder = folder;
    await loadFileList();
    currentProjectDisplay.textContent = "Project: " + getFolderName(folder);
    currentFileDisplay.textContent = "File: None";
    updateStatusBar();
  }

  async function loadFileList() {
    fileList.innerHTML = "";
    if (!currentFolder) return;
    const files = await window.api.listFiles(currentFolder);
    files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = getFileName(file);
      li.addEventListener("click", async () => {
        currentFile = currentFolder + "/" + file;
        const content = await window.api.readFile(currentFile);
        quill.root.innerHTML = content;
        isDirty = false;
        currentFileDisplay.textContent = "File: " + getFileName(currentFile);
        updateStatusBar();
      });
      fileList.appendChild(li);
    });
  }

  async function newFile() {
    if (!currentFolder) return;
    const filePath = await window.api.createFileDialog(currentFolder);
    if (!filePath) return;
    currentFile = filePath;
    quill.root.innerHTML = "";
    isDirty = true;
    currentFileDisplay.textContent = "File: " + getFileName(currentFile);
    await loadFileList();
    updateStatusBar();
  }

  async function saveFile() {
    if (!currentFile) return;
    const fileName = currentFile.split(/[\\/]/).pop();
    updateStatusBar(`Auto saving file: ${fileName}...`);
    const content = quill.root.innerHTML;
    await window.api.writeFile(currentFile, content);
    isDirty = false;
    updateStatusBar(`Saved: ${fileName}`);
    //console.log("Saved file:", currentFile);
  }

  async function deleteFile() {
    if (!currentFile) return;
    if (confirm(`Delete ${currentFile.split(/[\\/]/).pop()}?`)) {
      await window.api.deleteFile(currentFile);
      currentFile = null;
      quill.root.innerHTML = "";
      currentFileDisplay.textContent = "File: None";
      await loadFileList();
      updateStatusBar();
    }
  }
  
  // ------------------ Statusbar -------------------//

  function updateStatusBar(message = "") {
    const fileName = currentFile ? currentFile.split(/[\\/]/).pop() : "None";
    const text = quill.getText().trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    if (message) {
      status.textContent = `${message}   |   Words: ${wordCount}`;
    } else {
      status.textContent = `Loaded: ${fileName}   |   Words: ${wordCount}`;
    }
  }

  // ------------------ Sidebar Toggle & Resize -------------------//

  const toggleSidebarButton = document.getElementById("toggleSidebarButton");
  let sidebarLastWidth = sidebar.offsetWidth;
  
  toggleSidebarButton.addEventListener("click", () => {
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      sidebar.style.width = sidebarLastWidth + "px";
      editorContainer.style.marginLeft = sidebarLastWidth + "px";
      toggleSidebarButton.textContent = "☰";
    } else {
      sidebarLastWidth = sidebar.offsetWidth;
      sidebar.classList.add("hidden");
      sidebar.style.width = "30px";
      editorContainer.style.marginLeft = "30px";
      toggleSidebarButton.textContent = "☰";
    }
  });

  const resizer = document.getElementById("sidebar-resizer");
  let isResizing = false;

  resizer.addEventListener("mousedown", () => {
    isResizing = true;
    document.body.style.cursor = "ew-resize";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    if (sidebar.classList.contains("hidden")) return;
    const newWidth = e.clientX;
    if (newWidth >= 150 && newWidth <= 400) {
      sidebar.style.width = newWidth + "px";
      editorContainer.style.marginLeft = newWidth + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "default";
    }
  });

  // ----------------------- Menu -------------------------------

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
});
