// The preview is the thing that gets printed: the template renders into the
// sheet, the sheet is what the browser paginates onto A4 paper.

import { formatRange, toLines } from './helpers.js';

const A4_HEIGHT_PX = (297 * 96) / 25.4;

let templateLink = null;

export function setTemplateCSS(id) {
  if (!templateLink) {
    templateLink = document.createElement('link');
    templateLink.rel = 'stylesheet';
    templateLink.id = 'template-css';
    document.head.append(templateLink);
  }
  templateLink.href = `templates/${id}/template.css`;
}

export async function loadTemplate(id) {
  const module = await import(`../templates/${id}/template.js`);
  setTemplateCSS(id);
  return module;
}

export function renderPreview(sheet, template, data) {
  sheet.innerHTML = template.render(data);
}

// How many pages the sheet is worth. Chrome decides the real breaks, so this is
// an estimate and the app says so.
export function estimatePages(sheet) {
  const style = getComputedStyle(sheet);
  const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const pageContent = A4_HEIGHT_PX - padding;
  if (pageContent <= 0) return 1;
  const content = sheet.scrollHeight - padding;
  return Math.max(1, content / pageContent);
}

export function pagesLabel(pages) {
  const rounded = Math.round(pages * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `About ${text} page${rounded === 1 ? '' : 's'}`;
}

// Clicking a word in the preview jumps to the control that edits it.
export function initPreviewInteraction(sheet, formRoot) {
  sheet.addEventListener('click', (event) => {
    const field = event.target.closest('[data-field]');
    if (!field) return;
    event.preventDefault();
    focusField(formRoot, field.dataset.field);
  });

  formRoot.addEventListener('focusin', (event) => {
    const path = event.target.dataset?.field;
    if (!path) return;
    highlight(sheet, path);
  });

  formRoot.addEventListener('focusout', () => {
    sheet.querySelectorAll('.is-active').forEach((node) => node.classList.remove('is-active'));
  });
}

export function focusField(formRoot, path) {
  const control = [...formRoot.querySelectorAll('[data-field]')].find(
    (node) => node.dataset.field === path,
  );
  if (!control) return;
  control.focus();
  control.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function highlight(sheet, path) {
  sheet.querySelectorAll('.is-active').forEach((node) => node.classList.remove('is-active'));
  for (const node of sheet.querySelectorAll('[data-field]')) {
    if (node.dataset.field === path) node.classList.add('is-active');
  }
}

export { formatRange, toLines };
