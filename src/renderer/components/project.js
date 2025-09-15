import { updateStatus } from './statusbar.js';
import { setCurrentFile } from './statusbar.js';
import { getEditorContent, setEditorContent } from './editor.js';

let currentFolder = null;
let currentFile = null;
let currentFileDisplay;
export let isDirty = false;


export function initProject()
{
    currentFileDisplay = document.getElementById("currentFile");
}


/**
 * Open a project (folder)
 * @param {string} folder
 */
export async function openProject(folder) {
  currentFolder = folder;
  await loadFileList();
  const projectDisplay = document.getElementById('currentProjectSidebar');
  const fileDisplay = document.getElementById('currentFile');
  projectDisplay.textContent = 'Project: ' + folder.split(/[\\/]/).filter(Boolean).pop();
  fileDisplay.textContent = 'File: None';
  isDirty = false;
  updateStatus();
}

/**
 * Load the files of the current project
 */
export async function loadFileList() {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  if (!currentFolder) return;

  const files = await window.api.listFiles(currentFolder);

  files.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file.replace(/\.[^/.]+$/, ''); // filename without extension
    li.addEventListener('click', async () => {
      console.log("---clicked on a file");
           
      currentFile = currentFolder + '/' + file;
             
      currentFileDisplay.textContent = "File: " + getFileNameWithoutExtension();
      
      const content = await window.api.readFile(currentFile);
      setEditorContent(content);
      setCurrentFile(currentFile);
    });
    fileList.appendChild(li);
  });
}

/**
 * Create a new file
 */
export async function newFile() {
  if (!currentFolder) return;
  const filePath = await window.api.createFileDialog(currentFolder);
  if (!filePath) return;

  currentFile = filePath;
  setEditorContent('');
  setCurrentFile(currentFile);

  await loadFileList();
  updateStatus();
}

/**
 * Save the current file
 */
export async function saveFile() {
  if (!currentFile) return;
  const content = getEditorContent();
  await window.api.writeFile(currentFile, content);
  updateStatus(`Saved: ${currentFile.split(/[\\/]/).pop()}`);
}

/**
 * Delete the current file
 */
export async function deleteFile() {
  if (!currentFile) return;
  if (!confirm(`Delete ${currentFile.split(/[\\/]/).pop()}?`)) return;

  await window.api.deleteFile(currentFile);
  currentFile = null;
  setEditorContent('');
  setCurrentFile(null);
  await loadFileList();
  updateStatus();
}

/**
 * Get the current file path
 */
export function getCurrentFile() {
  return currentFile;
}

export function getFolderName() {
  return currentFolder.split(/[\\/]/).filter(Boolean).pop();
}
export function getFileNameWithoutExtension() {
  const name = currentFile.split(/[\\/]/).pop();
  return name.replace(/\.[^/.]+$/, "");
}