// Classic template: one column, serif, ATS friendly.
//
// The contract this file follows lives in docs/TEMPLATE-CONTRACT.md. It is
// handed { profile, sections } and returns a complete HTML fragment.

import { escapeHtml, formatRange, stripScheme, toLines } from '../../app/helpers.js';
import { icon } from '../../app/icons.js';

export function render(data) {
  return [
    '<div class="cv">',
    renderHeader(data.profile),
    ...data.sections.map(renderSection),
    '</div>',
  ].join('\n');
}

function renderHeader(profile) {
  const rows = profile.contacts.rows
    .map((row, rowIndex) => {
      const items = row.items
        .map((item, itemIndex) =>
          renderContact(item, `profile.contacts.rows[${rowIndex}].items[${itemIndex}]`),
        )
        .filter(Boolean);
      if (!items.length) return '';
      return `<div class="cv-contact-row">${items.join('')}</div>`;
    })
    .filter(Boolean)
    .join('\n');

  return [
    '<header class="cv-header">',
    `<div class="cv-name" data-field="profile.name">${escapeHtml(profile.name)}</div>`,
    profile.headline
      ? `<div class="cv-headline" data-field="profile.headline">${escapeHtml(profile.headline)}</div>`
      : '',
    rows,
    '</header>',
  ].join('\n');
}

function renderContact(item, path) {
  if (!item.text) return '';
  const body = `${icon(item.type)}<span data-field="${path}.value">${escapeHtml(item.text)}</span>`;
  const className = 'cv-contact';
  if (item.link) {
    return `<a class="${className}" href="${escapeHtml(item.link)}">${body}</a>`;
  }
  return `<span class="${className}">${body}</span>`;
}

function renderSection(section) {
  switch (section.type) {
    case 'summary':
      return renderSummary(section);
    case 'education':
      return renderEducation(section);
    case 'experience':
      return renderExperience(section);
    case 'projects':
      return renderProjects(section);
    case 'skills':
    case 'languages':
      return renderPairs(section);
    case 'courses':
      return renderCourses(section);
    case 'custom':
      return renderCustom(section);
    default:
      return '';
  }
}

function sectionWrap(section, content) {
  if (!content) return '';
  return [
    '<section class="cv-section">',
    `<div class="cv-section-head" data-field="sections.${section.key}.heading">${escapeHtml(section.heading)}</div>`,
    content,
    '</section>',
  ].join('\n');
}

function renderSummary(section) {
  const body = String(section.body ?? '').trim();
  if (!body) return '';
  return sectionWrap(
    section,
    `<p class="cv-p" data-field="sections.${section.key}.body">${escapeHtml(body)}</p>`,
  );
}

function renderEducation(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const institution = entry.institution?.trim();
      const degree = entry.degree?.trim();
      const location = entry.location?.trim();
      const dates = formatRange(entry.dates);
      if (!institution && !degree && !location && !dates) return '';
      return [
        '<div class="cv-entry">',
        row([
          institution ? `<b data-field="${path}.institution">${escapeHtml(institution)}</b>` : '',
          dates ? `<b data-field="${path}.dates.start">${escapeHtml(dates)}</b>` : '',
        ]),
        row([
          degree ? `<i data-field="${path}.degree">${escapeHtml(degree)}</i>` : '',
          location ? `<i data-field="${path}.location">${escapeHtml(location)}</i>` : '',
        ]),
        '</div>',
      ].join('');
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries);
}

function renderExperience(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const role = entry.role?.trim();
      const organisation = entry.organisation?.trim();
      const location = entry.location?.trim();
      const dates = formatRange(entry.dates);
      const bullets = toLines(entry.bullets);
      if (!role && !organisation && !location && !dates && !bullets.length) return '';
      return [
        '<div class="cv-entry">',
        row([
          role ? `<b data-field="${path}.role">${escapeHtml(role)}</b>` : '',
          dates ? `<b data-field="${path}.dates.start">${escapeHtml(dates)}</b>` : '',
        ]),
        row([
          organisation ? `<i data-field="${path}.organisation">${escapeHtml(organisation)}</i>` : '',
          location ? `<i data-field="${path}.location">${escapeHtml(location)}</i>` : '',
        ]),
        bulletList(bullets),
        '</div>',
      ].join('');
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries);
}

function renderProjects(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const name = entry.name?.trim();
      const stack = entry.stack?.trim();
      const dates = formatRange(entry.dates);
      const bullets = toLines(entry.bullets);
      const url = entry.url?.trim();
      if (!name && !stack && !dates && !bullets.length && !url) return '';
      const title = [
        name ? `<b data-field="${path}.name">${escapeHtml(name)}</b>` : '',
        stack ? `<i data-field="${path}.stack">${escapeHtml(stack)}</i>` : '',
      ]
        .filter(Boolean)
        .join(' <span class="cv-sep">|</span> ');
      return [
        '<div class="cv-entry">',
        row([
          `<span>${title}</span>`,
          dates ? `<b data-field="${path}.dates.start">${escapeHtml(dates)}</b>` : '',
        ]),
        url
          ? `<div class="cv-meta"><a data-field="${path}.url" href="${escapeHtml(withHttps(url))}">${escapeHtml(stripScheme(url))}</a></div>`
          : '',
        bulletList(bullets),
        '</div>',
      ].join('');
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries);
}

function renderPairs(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const label = entry.label?.trim();
      const items = entry.items?.trim();
      if (!label && !items) return '';
      return `<div><b data-field="${path}.label">${escapeHtml(label)}</b>${
        label && items ? ': ' : ''
      }<span data-field="${path}.items">${escapeHtml(items)}</span></div>`;
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries ? `<div class="cv-skills">${entries}</div>` : '');
}

function renderCourses(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const name = entry.name?.trim();
      const provider = entry.provider?.trim();
      const dates = formatRange(entry.dates);
      const note = entry.note?.trim();
      if (!name && !provider && !dates && !note) return '';
      return [
        '<div class="cv-entry">',
        row([
          name ? `<b data-field="${path}.name">${escapeHtml(name)}</b>` : '',
          dates ? `<b data-field="${path}.dates.start">${escapeHtml(dates)}</b>` : '',
        ]),
        row([provider ? `<i data-field="${path}.provider">${escapeHtml(provider)}</i>` : '']),
        note ? `<p class="cv-note" data-field="${path}.note">${escapeHtml(note)}</p>` : '',
        '</div>',
      ].join('');
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries);
}

function renderCustom(section) {
  const entries = section.entries
    .map((entry, i) => {
      const path = `sections.${section.key}.entries[${i}]`;
      const title = entry.title?.trim();
      const subtitle = entry.subtitle?.trim();
      const dates = formatRange(entry.dates);
      const bullets = toLines(entry.bullets);
      if (!title && !subtitle && !dates && !bullets.length) return '';
      return [
        '<div class="cv-entry">',
        row([
          title ? `<b data-field="${path}.title">${escapeHtml(title)}</b>` : '',
          dates ? `<b data-field="${path}.dates.start">${escapeHtml(dates)}</b>` : '',
        ]),
        row([subtitle ? `<i data-field="${path}.subtitle">${escapeHtml(subtitle)}</i>` : '']),
        bulletList(bullets),
        '</div>',
      ].join('');
    })
    .filter(Boolean)
    .join('\n');
  return sectionWrap(section, entries);
}

function row(parts) {
  const kept = parts.filter(Boolean);
  if (!kept.length) return '';
  return `<div class="cv-row">${kept.join('')}</div>`;
}

function bulletList(bullets) {
  if (!bullets.length) return '';
  return `<ul class="cv-list">${bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join('')}</ul>`;
}

function withHttps(url) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}
