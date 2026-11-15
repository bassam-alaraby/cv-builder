// The document lives in this browser only. Export/Import is the way out of it.

const DOC_KEY = 'cv-builder:document:v1';
const UI_KEY = 'cv-builder:ui:v1';

export function loadDocument() {
  try {
    const raw = localStorage.getItem(DOC_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDocument(doc) {
  try {
    localStorage.setItem(DOC_KEY, JSON.stringify(doc));
  } catch {
    /* private mode or full storage: the app keeps working, it just cannot save. */
  }
}

export function clearDocument() {
  try {
    localStorage.removeItem(DOC_KEY);
  } catch {
    /* ignore */
  }
}

export function loadUI() {
  try {
    return JSON.parse(localStorage.getItem(UI_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveUI(ui) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(ui));
  } catch {
    /* ignore */
  }
}

export function downloadJSON(doc, filename) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function readJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch (error) {
        reject(new Error('That file is not valid JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('That file could not be read.'));
    reader.readAsText(file);
  });
}
