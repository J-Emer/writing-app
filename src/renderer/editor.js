import { saveFile } from './project.js';
import { updateStatus } from './statusbar.js';

let quill;
let autosaveTimer = null;

export function initEditor() {
  quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['clean']
      ]
    }
  });

  // Tooltips
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

  // ---------------- Auto-save ----------------
  quill.on('text-change', () => {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(async () => {
    console.log("---trying to save");
      try {
        await saveFile();      // call saveFile from project.js
        updateStatus("Saving: ");     // update word count / status
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 1000); // 1 second after user stops typing
  });
}

export function getEditorContent() {
  return quill ? quill.root.innerHTML : '';
}

export function setEditorContent(content) {
  if (quill) quill.root.innerHTML = content;
}

export { quill, autosaveTimer }; // export quill if other modules need it
