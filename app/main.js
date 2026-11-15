import { buildForm, firstEntryFieldPath, openRow, sectionKeyForPath, updateRows } from './form.js';
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
  focusField,
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
import { MOBILE_LAYOUT, focusModeFor } from './layout.js';
import { currentTemplate } from '../templates/index.js';

const els = {
  form: document.getElementById('formPane'),
  sheet: document.getElementById('sheet'),
  frame: document.getElementById('sheetFrame'),
  wrap: document.getElementById('sheetWrap'),
  pages: document.getElementById('pages'),
  zoom: document.getElementById('zoom'),
  status: document.getElementById('status'),
  file: document.getElementById('fileInput'),
  focus: document.getElementById('focusButton'),
  printDialog: document.getElementById('printDialog'),
  printDismiss: document.getElementById('printTipsDismiss'),
};

const mobileLayout = window.matchMedia(MOBILE_LAYOUT);

let doc = null;
let template = null;
let sample = null;
let ui = loadUI();
let openKey = 'profile';

async function start() {
  template = await loadTemplate(currentTemplate.id);
  sample = (await import(`../templates/${currentTemplate.id}/sample.js`)).sample;

  const stored = loadDocument();
  doc = stored && validateDocument(stored).ok ? stored : clone(sample);
  if (!stored) saveDocument(doc);

  els.zoom.value = ui.zoom || 'fit';
  if (mobileLayout.matches) {
    document.body.classList.add('tab-edit');
  }

  // A reload always lands on a section: an empty index is not a place to start.
  openKey = ui.openSection || 'profile';

  buildForm(els.form, doc, openKey);
  setFocusMode(ui.focusMode);
  initPreviewInteraction(els.sheet, els.form, selectField);
  wire();
  commit();
}

// Which section of the form is open.
function openSection() {
  return openKey;
}

// Opening a row happens in place: rebuilding the form would take the
// visitor's focus, scroll position and half typed word with it.
function setOpenSection(key) {
  openKey = key;
  ui.openSection = key;
  saveUI(ui);
  openRow(els.form, key);
}

// Clicking a word in the preview opens the section that holds it, then puts
// the cursor in the field itself.
function selectField(path) {
  const key = sectionKeyForPath(path);
  if (key && openSection() !== key) setOpenSection(key);
  focusField(els.form, path);
}

function commit() {
  saveDocument(doc);
  renderPreview(els.sheet, template, toTemplateData(doc));
  updateRows(els.form, doc);
  document.title = (doc.profile.name || '').trim() || 'CV Builder';
  requestAnimationFrame(updateLayout);
}

function rebuildForm() {
  buildForm(els.form, doc, openKey);
  // An imported CV can drop the section that was open; land somewhere real.
  if (!els.form.querySelector(`[data-sec="${CSS.escape(openKey)}"]`)) {
    openKey = 'profile';
    ui.openSection = openKey;
    saveUI(ui);
    openRow(els.form, openKey);
  }
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
  // A pane hidden by a stale focus state would leave the tab blank.
  if (document.body.classList.contains('focus-mode')) setFocusMode(false);
  document.body.classList.toggle('tab-edit', name === 'edit');
  document.body.classList.toggle('tab-preview', name === 'preview');
  for (const button of document.querySelectorAll('[data-tab]')) {
    button.setAttribute('aria-selected', String(button.dataset.tab === name));
  }
  updateLayout();
}

// The print tips live in a dialog so the preview keeps its full height. The
// dialog's return value decides whether the browser's print dialog follows.
function openPrintDialog() {
  els.printDismiss.checked = Boolean(ui.printTipsDismissed);
  els.printDialog.returnValue = '';
  els.printDialog.showModal();
}

// Focus mode is desktop only: it hides the form pane, which on the tab layout
// is the Edit tab. Leaving it must never be a one way trip.
function setFocusMode(on) {
  const active = focusModeFor(on, mobileLayout.matches);
  document.body.classList.toggle('focus-mode', active);
  els.focus.setAttribute('aria-pressed', String(active));
  els.focus.textContent = active ? 'Exit focus' : 'Focus';
  ui.focusMode = active;
  saveUI(ui);
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
    let pendingFocus = null;

    switch (action) {
      case 'sec-toggle': {
        const key = target.dataset.sec;
        setOpenSection(openSection() === key ? null : key);
        return;
      }
      case 'entry-add': {
        const added = addEntry(doc, section);
        pendingFocus = firstEntryFieldPath(section, added);
        break;
      }
      case 'entry-remove':
        removeEntry(doc, section, index);
        break;
      case 'entry-up':
        moveEntry(doc, section, index, -1);
        break;
      case 'entry-down':
        moveEntry(doc, section, index, 1);
        break;
      case 'custom-add': {
        const added = addCustomSection(doc);
        openKey = `custom[${added}]`;
        ui.openSection = openKey;
        saveUI(ui);
        pendingFocus = `sections.custom[${added}].heading`;
        break;
      }
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
    if (pendingFocus) focusField(els.form, pendingFocus);
  });

  // Printing starts with the settings the PDF needs; the tips can be silenced
  // once the user knows them, and the footer re-opens them.
  document.getElementById('printButton').addEventListener('click', () => {
    if (ui.printTipsDismissed) window.print();
    else openPrintDialog();
  });

  els.printDialog.addEventListener('close', () => {
    if (els.printDialog.returnValue === 'print') window.print();
  });

  els.printDismiss.addEventListener('change', () => {
    ui.printTipsDismissed = els.printDismiss.checked;
    saveUI(ui);
  });

  document.getElementById('printTipsButton').addEventListener('click', openPrintDialog);

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

  els.focus.addEventListener('click', () => {
    setFocusMode(!document.body.classList.contains('focus-mode'));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !document.body.classList.contains('focus-mode')) return;
    if (document.getElementById('howDialog').open) return;
    setFocusMode(false);
    els.focus.focus();
  });

  // Rotating a phone or shrinking the window into the tab layout drops focus
  // mode, so the form is never left hidden behind it.
  mobileLayout.addEventListener('change', () => {
    if (mobileLayout.matches) setTab('edit');
    else updateLayout();
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

  els.printDialog.querySelector('[data-close]').addEventListener('click', () => {
    els.printDialog.close('cancel');
  });
  document.getElementById('continuePrint').addEventListener('click', () => {
    els.printDialog.close('print');
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateLayout, 100);
  });
}

start();
