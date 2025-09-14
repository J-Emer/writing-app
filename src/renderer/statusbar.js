import { getEditorContent } from './editor.js';
import { getFileNameWithoutExtension } from './project.js';

let statusElement = null;
let currentFile = null;

/**
 * Initialize status bar by passing in the DOM element
 * @param {HTMLElement} element
 */
export function initStatusBar(fileRef) {
  statusElement = document.getElementById("status");
  if (fileRef) {
    currentFile = fileRef; // pass currentFile reference if needed
  }
  updateStatus();
}

/**
 * Update the status bar
 * @param {string} message optional message to display
 */
export function updateStatus(message = "") {
  if (!statusElement) return;

  console.log("---updatingStatus");
  const fileName = currentFile ? currentFile.split(/[\\/]/).pop() : "None";
  const text = getEditorContent().trim();
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (message) {
    statusElement.textContent = `${message + getFileNameWithoutExtension()}  |   Words: ${wordCount}`;
  } else {
    statusElement.textContent = `Loaded: ${fileName}   |   Words: ${wordCount}`;
  }
}

/**
 * Set the current file for status tracking
 * @param {string} filePath
 */
export function setCurrentFile(filePath) {
  currentFile = filePath;
  updateStatus();
}