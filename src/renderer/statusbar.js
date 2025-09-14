export function updateStatus(message) {
  const statusBar = document.getElementById('status-bar');
  statusBar.textContent = message;
}
