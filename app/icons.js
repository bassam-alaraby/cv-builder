// Built-in outline icons, one per contact type. Generic shapes only, so the
// project ships no brand marks. Every icon is aria-hidden: it carries no text
// and never reaches the printed words.

const svg = (body) =>
  `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" ` +
  `stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ` +
  `focusable="false">${body}</svg>`;

export const icons = {
  phone: svg('<path d="M4.2 1.9h2.2l1.1 2.7-1.5 1.2a8.7 8.7 0 0 0 4.2 4.2l1.2-1.5 2.7 1.1v2.2a1 1 0 0 1-1.1 1A12.4 12.4 0 0 1 3.2 3a1 1 0 0 1 1-1.1Z"/>'),
  email: svg('<rect x="1.6" y="3.4" width="12.8" height="9.2" rx="1"/><path d="M2.2 4.4 8 8.9l5.8-4.5"/>'),
  website: svg('<circle cx="8" cy="8" r="6.4"/><path d="M1.6 8h12.8"/><path d="M8 1.6c1.9 1.9 2.9 4 2.9 6.4S9.9 12.5 8 14.4C6.1 12.5 5.1 10.4 5.1 8S6.1 3.5 8 1.6Z"/>'),
  github: svg('<path d="M6 4.6 2.6 8 6 11.4"/><path d="M10 4.6 13.4 8 10 11.4"/>'),
  linkedin: svg('<circle cx="8" cy="4.6" r="2.2"/><path d="M3.2 14v-3.6a4.8 4.8 0 0 1 9.6 0V14"/>'),
  location: svg('<path d="M8 14.4s5-4.6 5-8a5 5 0 1 0-10 0c0 3.4 5 8 5 8Z"/><circle cx="8" cy="6.4" r="1.8"/>'),
  x: svg('<circle cx="8" cy="8" r="4.6"/><path d="M8 6.6v2.8"/><path d="M11 9.4a3.1 3.1 0 0 1-6 0"/>'),
  other: svg('<path d="M6.6 9.4 9.4 6.6"/><path d="M7.1 12.1 5.6 13.6a2.9 2.9 0 0 1-4.1-4.1L3 8"/><path d="M8.9 3.9l1.5-1.5a2.9 2.9 0 0 1 4.1 4.1L13 8"/>'),
};

export function icon(type) {
  return icons[type] || icons.other;
}
