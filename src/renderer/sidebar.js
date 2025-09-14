export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const editorContainer = document.getElementById("editorContainer");
  const toggleSidebarButton = document.getElementById("toggleSidebarButton");
  const resizer = document.getElementById("sidebar-resizer");

  if (!sidebar || !editorContainer || !toggleSidebarButton || !resizer) {
    console.error("Sidebar or editor elements not found in DOM");
    return;
  }

  // ------------------ Sidebar Toggle & Resize -------------------
  let sidebarLastWidth = sidebar.offsetWidth;
  let isResizing = false;

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
}