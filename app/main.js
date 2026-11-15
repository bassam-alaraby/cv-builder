import { buildForm, focusAutofocus } from './form.js';
import {
  addContactItem,
  addContactRow,
  addCustomSection,
  addEntry,
  clone,
  findSection,
  moveContactItem,
  moveContactItemToNextRow,
  moveEntry,
  removeContactItem,
  removeContactRow,
  removeCustomSection,
  removeEntry,
  toTemplateData,
} from './model.js';
import { setPath } from './paths.js';
import {
  estimatePages,
  initPreviewInteraction,
  loadTemplate,
  pagesLabel,
  renderPreview,
} from './preview.js';
import {
  clearDocument,
  downloadJSON,
  loadDocument,
  loadUI,
  readJSON,
  saveDocument,
  saveUI,
} from './storage.js';
import { validateDocument } from './schema.js';
import { currentTemplate } from '../templates/index.js';

const els = {
  form: document.getElementById('formPane'),
  sheet: document.getElementById('sheet'),
  frame: document.getElementById('sheetFrame'),
  wrap: document.getElementById('sheetWrap'),
  pages: document.getElementById('pages'),
  zoom: document.getElementById('zoom'),
  tips: document.getElementById('printTips'),
  status: document.getElementById('status'),
  file: document.getElementById('fileInput'),
};

let doc = null;
let template = null;
let sample = null;
let ui = loadUI();

async function start() {
  template = await loadTemplate(currentTemplate.id);
  sample = (await import(`../templates/${currentTemplate.id}/sample.js`)).sample;

  const stored = loadDocument();
  doc = stored && validateDocument(stored).ok ? stored : clone(sample);
  if (!stored) saveDocument(doc);

  els.zoom.value = ui.zoom || 'fit';
  els.tips.hidden = Boolean(ui.tipsDismissed);
  if (window.matchMedia('(max-width: 980px)').matches) {
    document.body.classList.add('tab-edit');
  }

  buildForm(els.form, doc);
  initPreviewInteraction(els.sheet, els.form);
  wire();
  commit();
}

function commit() {
  saveDocument(doc);
  renderPreview(els.sheet, template, toTemplateData(doc));
  document.title = (doc.profile.name || '').trim() || 'CV Builder';
  requestAnimationFrame(updateLayout);
}

function rebuildForm() {
  buildForm(els.form, doc);
  commit();
}

function updateLayout() {
  const sheetWidth = els.sheet.offsetWidth;
  const available = els.wrap.clientWidth - 32;
  const mode = els.zoom.value;
  const scale = mode === 'fit' ? Math.min(1, available / sheetWidth) : Number(mode) || 1;

  els.sheet.style.transform = `scale(${scale})`;
  els.frame.style.width = `${Math.round(sheetWidth * scale)}px`;
  els.frame.style.height = `${Math.round(els.sheet.scrollHeight * scale)}px`;
  els.pages.textContent = pagesLabel(estimatePages(els.sheet));
}

function setTab(name) {
  document.body.classList.toggle('tab-edit', name === 'edit');
  document.body.classList.toggle('tab-preview', name === 'preview');
  for (const button of document.querySelectorAll('[data-tab]')) {
    button.setAttribute('aria-selected', String(button.dataset.tab === name));
  }
  updateLayout();
}

function setStatus(message, isError = false) {  els.status.textContent = message || '';
  els.status.classList.toggle('is-error', isError);
  if (message && !isError) {
    setTimeout(() => {
      if (els.status.textContent === message) els.status.textContent = '';
    }, 4000);
  }
}

function wire() {
  els.form.addEventListener('input', (event) => {
    const field = event.target.dataset?.field;
    if (!field || event.target.type === 'checkbox') return;
    setPath(doc, field, event.target.value);
    commit();
  });

  els.form.addEventListener('change', (event) => {
    const key = event.target.dataset?.visible;
    if (!key) return;
    const found = findSection(doc, key);
    if (found) {
      found.section.visible = event.target.checked;
      commit();
    }
  });

  els.form.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const index = Number(target.dataset.index);
    const row = Number(target.dataset.row);
    const section = target.dataset.section;

    switch (action) {
      case 'entry-add':
        addEntry(doc, section);
        break;
      case 'entry-remove':
        removeEntry(doc, section, index);
        break;
      case 'entry-up':
        moveEntry(doc, section, index, -1);
        break;
      case 'entry-down':
        moveEntry(doc, section, index, 1);
        break;
      case 'custom-add':
        addCustomSection(doc);
        break;
      case 'custom-remove':
        removeCustomSection(doc, index);
        break;
      case 'row-add':
        addContactRow(doc);
        break;
      case 'row-remove':
        removeContactRow(doc, row);
        break;
      case 'item-add':
        addContactItem(doc, row);
        break;
      case 'item-remove':
        removeContactItem(doc, row, index);
        break;
      case 'item-up':
        moveContactItem(doc, row, index, -1);
        break;
      case 'item-down':
        moveContactItem(doc, row, index, 1);
        break;
      case 'item-row':
        moveContactItemToNextRow(doc, row, index);
        break;
      default:
        return;
    }
    rebuildForm();
  });

  document.getElementById('printButton').addEventListener('click', () => window.print());
  document.getElementById('dismissTips').addEventListener('click', () => {
    els.tips.hidden = true;
    ui.tipsDismissed = true;
    saveUI(ui);
  });

  document.getElementById('exportButton').addEventListener('click', () => {
    const name = (doc.profile.name || 'cv').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadJSON(doc, `${name || 'cv'}.json`);
  });

  document.getElementById('importButton').addEventListener('click', () => els.file.click());
  els.file.addEventListener('change', async () => {
    const file = els.file.files?.[0];
    els.file.value = '';
    if (!file) return;
    try {
      const parsed = await readJSON(file);
      const result = validateDocument(parsed);
      if (!result.ok) {
        setStatus(`That file is not a CV file: ${result.errors[0]}`, true);
        return;
      }
      doc = parsed;
      rebuildForm();
      setStatus('CV imported.');
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.getElementById('resetButton').addEventListener('click', () => {
    if (!window.confirm('Reset the CV back to the sample? Your current edits are lost.')) return;
    doc = clone(sample);
    clearDocument();
    rebuildForm();
    setStatus('Reset to the sample CV.');
  });

  els.zoom.addEventListener('change', () => {
    ui.zoom = els.zoom.value;
    saveUI(ui);
    updateLayout();
  });

  document.getElementById('focusButton').addEventListener('click', () => {
    document.body.classList.toggle('focus-mode');
    updateLayout();
  });

  for (const button of document.querySelectorAll('[data-tab]')) {
    button.addEventListener('click', () => setTab(button.dataset.tab));
  }

  // On a phone the preview and the form are separate tabs: clicking a word in
  // the preview takes you to the tab that edits it.
  els.sheet.addEventListener('click', () => {
    if (document.body.classList.contains('tab-preview')) setTab('edit');
  });

  const dialog = document.getElementById('howDialog');
  document.getElementById('howButton').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateLayout, 100);
  });
}

start();
