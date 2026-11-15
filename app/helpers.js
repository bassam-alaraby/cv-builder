// Shared by the app and by every template. Templates import these so that
// dates, links and bullet lists look the same in all of them.

export const PLATFORM_HOSTS = {
  github: 'github.com',
  linkedin: 'linkedin.com/in',
  x: 'x.com',
};

export function stripScheme(url) {
  return String(url ?? '').trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
}

function withScheme(value) {
  const trimmed = String(value ?? '').trim();
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// "bassam" -> "github.com/bassam", "github.com/bassam" -> unchanged.
function platformPath(host, value) {
  const path = stripScheme(value).replace(/^\/+/, '');
  if (path.toLowerCase().startsWith(host.toLowerCase()) || path.includes('/')) return path;
  return `${host}/${path}`;
}

// The href for a contact item. An explicit url always wins.
export function deriveLink(type, value, override) {
  const url = String(override ?? '').trim();
  const text = String(value ?? '').trim();
  if (url) {
    if (type === 'email') return url.startsWith('mailto:') ? url : `mailto:${url}`;
    if (type === 'phone') {
      return url.startsWith('tel:') ? url : `tel:${url.replace(/[^\d+]/g, '')}`;
    }
    return withScheme(url);
  }
  if (!text) return '';
  switch (type) {
    case 'email':
      return `mailto:${text}`;
    case 'phone':
      return `tel:${text.replace(/[^\d+]/g, '')}`;
    case 'location':
      return '';
    case 'github':
      return withScheme(platformPath(PLATFORM_HOSTS.github, text));
    case 'linkedin':
      return withScheme(platformPath(PLATFORM_HOSTS.linkedin, text));
    case 'x':
      return withScheme(platformPath(PLATFORM_HOSTS.x, text));
    default:
      return withScheme(text);
  }
}

// What gets printed next to the icon. Never contains "https://".
export function contactText(type, value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  if (PLATFORM_HOSTS[type]) return stripScheme(platformPath(PLATFORM_HOSTS[type], text));
  if (type === 'website' || type === 'other') return stripScheme(text);
  return text;
}

// "2024" + no end -> "2024 – Present".
export function formatRange(dates) {
  const start = String(dates?.start ?? '').trim();
  const end = String(dates?.end ?? '').trim();
  if (!start && !end) return '';
  if (!end) return start === 'Present' ? 'Present' : `${start} – Present`;
  if (!start) return end;
  return `${start} – ${end}`;
}

// One bullet per line, blank lines dropped.
export function toLines(text) {
  return String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}
