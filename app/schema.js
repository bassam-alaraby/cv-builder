// The one description of the document shape. It drives the form, the sample
// defaults and import validation. Templates are presentation only: they never
// add fields, they only lay the ones defined here out.

export const DOCUMENT_VERSION = 1;

export const SECTION_ORDER = [
  'summary',
  'education',
  'experience',
  'projects',
  'skills',
  'courses',
  'languages',
];

export const SECTIONS = {
  summary: {
    heading: 'Summary',
    shape: 'text',
    fields: [{ key: 'body', label: 'Text', type: 'textarea' }],
  },
  education: {
    heading: 'Education',
    shape: 'entries',
    fields: [
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'daterange' },
    ],
  },
  experience: {
    heading: 'Experience',
    shape: 'entries',
    fields: [
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'organisation', label: 'Organisation', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'daterange' },
      { key: 'bullets', label: 'Bullets (one per line)', type: 'lines' },
    ],
  },
  projects: {
    heading: 'Projects',
    shape: 'entries',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'stack', label: 'Stack', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'daterange' },
      { key: 'bullets', label: 'Bullets (one per line)', type: 'lines' },
      { key: 'url', label: 'URL', type: 'text' },
    ],
  },
  skills: {
    heading: 'Technical Skills',
    shape: 'entries',
    fields: [
      { key: 'label', label: 'Category', type: 'text' },
      { key: 'items', label: 'Items (comma separated)', type: 'text' },
    ],
  },
  courses: {
    heading: 'Courses',
    shape: 'entries',
    fields: [
      { key: 'name', label: 'Course', type: 'text' },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'daterange' },
      { key: 'note', label: 'Note', type: 'text' },
    ],
  },
  languages: {
    heading: 'Languages',
    shape: 'entries',
    fields: [
      { key: 'label', label: 'Language', type: 'text' },
      { key: 'items', label: 'Proficiency (comma separated)', type: 'text' },
    ],
  },
};

export const CUSTOM = {
  heading: 'Custom',
  shape: 'entries',
  fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'dates', label: 'Dates', type: 'daterange' },
    { key: 'bullets', label: 'Bullets (one per line)', type: 'lines' },
  ],
};

export const CONTACT_TYPES = [
  'phone',
  'email',
  'website',
  'github',
  'linkedin',
  'location',
  'x',
  'other',
];

export function sectionDef(type) {
  return type === 'custom' ? CUSTOM : SECTIONS[type];
}

export function emptyValue(field) {
  return field.type === 'daterange' ? { start: '', end: '' } : '';
}

export function emptyEntry(type) {
  const entry = {};
  for (const field of sectionDef(type).fields) entry[field.key] = emptyValue(field);
  return entry;
}

export function emptySection(type) {
  const def = sectionDef(type);
  const section = { type, heading: def.heading, visible: true };
  if (def.shape === 'text') section.body = '';
  else section.entries = [];
  return section;
}

export function emptyContactItem(type = 'other') {
  return { type, value: '', url: '' };
}

// Import guard. Returns { ok, errors } and never throws.
const isStr = (value) => typeof value === 'string';
const isBool = (value) => typeof value === 'boolean';

export function validateDocument(doc) {
  const errors = [];

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, errors: ['File is not a CV document.'] };
  }
  if (doc.version !== DOCUMENT_VERSION) {
    errors.push(`Unsupported file version (${JSON.stringify(doc.version)}).`);
  }

  const profile = doc.profile;
  if (!profile || typeof profile !== 'object') {
    errors.push('Missing profile.');
  } else {
    if (!isStr(profile.name)) errors.push('Profile.name must be text.');
    if (!isStr(profile.headline)) errors.push('Profile.headline must be text.');
    const rows = profile.contacts && profile.contacts.rows;
    if (!Array.isArray(rows)) {
      errors.push('Profile.contacts.rows must be a list.');
    } else {
      rows.forEach((row, r) => {
        if (!row || !Array.isArray(row.items)) {
          errors.push(`Contact row ${r + 1} has no items.`);
          return;
        }
        row.items.forEach((item, i) => {
          if (!item || !CONTACT_TYPES.includes(item.type)) {
            errors.push(`Contact row ${r + 1} item ${i + 1} has an unknown type.`);
            return;
          }
          if (!isStr(item.value)) errors.push(`Contact row ${r + 1} item ${i + 1} value must be text.`);
          if (item.url !== undefined && !isStr(item.url)) {
            errors.push(`Contact row ${r + 1} item ${i + 1} url must be text.`);
          }
        });
      });
    }
  }

  const sections = doc.sections;
  if (!sections || typeof sections !== 'object') {
    errors.push('Missing sections.');
  } else {
    for (const type of SECTION_ORDER) {
      const section = sections[type];
      if (!section || typeof section !== 'object') {
        errors.push(`Missing section: ${type}.`);
        continue;
      }
      errors.push(...validateSection(section, type));
    }
    if (!Array.isArray(sections.custom)) {
      errors.push('Section list "custom" must be a list.');
    } else {
      sections.custom.forEach((section, i) => {
        errors.push(...validateSection(section, 'custom', i));
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

function validateSection(section, type, customIndex) {
  const errors = [];
  const where = customIndex === undefined ? type : `custom[${customIndex}]`;
  const def = sectionDef(type);
  if (!isStr(section.heading)) errors.push(`Section ${where}: heading must be text.`);
  if (!isBool(section.visible)) errors.push(`Section ${where}: visible must be true or false.`);
  if (def.shape === 'text') {
    if (!isStr(section.body)) errors.push(`Section ${where}: body must be text.`);
    return errors;
  }
  if (!Array.isArray(section.entries)) {
    errors.push(`Section ${where}: entries must be a list.`);
    return errors;
  }
  section.entries.forEach((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      errors.push(`Section ${where} entry ${i + 1} is not an object.`);
      return;
    }
    for (const field of def.fields) {
      const value = entry[field.key];
      if (field.type === 'daterange') {
        if (!value || !isStr(value.start) || !isStr(value.end)) {
          errors.push(`Section ${where} entry ${i + 1}: ${field.key} needs start and end text.`);
        }
      } else if (!isStr(value)) {
        errors.push(`Section ${where} entry ${i + 1}: ${field.key} must be text.`);
      }
    }
  });
  return errors;
}
