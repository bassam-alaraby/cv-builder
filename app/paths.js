// Field Paths address a single editable value inside the document, e.g.
// "profile.email" or "sections.education.entries[0].institution".
// The preview and the form both carry the same path in a data-field attribute;
// that is how clicking the preview finds the control that edits it.

export function parsePath(path) {
  const segments = [];
  for (const match of String(path).matchAll(/([A-Za-z_][A-Za-z0-9_]*)(?:\[(\d+)\])?/g)) {
    segments.push([match[1], match[2] === undefined ? null : Number(match[2])]);
  }
  return segments;
}

export function getPath(object, path) {
  let current = object;
  for (const [key, index] of parsePath(path)) {
    if (current == null) return undefined;
    current = current[key];
    if (index !== null) {
      if (current == null) return undefined;
      current = current[index];
    }
  }
  return current;
}

export function setPath(object, path, value) {
  const segments = parsePath(path);
  let current = object;
  segments.forEach(([key, index], i) => {
    const last = i === segments.length - 1;
    if (index === null) {
      if (last) {
        current[key] = value;
        return;
      }
      if (current[key] == null) current[key] = {};
      current = current[key];
      return;
    }
    if (current[key] == null) current[key] = [];
    if (last) {
      current[key][index] = value;
      return;
    }
    if (current[key][index] == null) current[key][index] = {};
    current = current[key][index];
  });
  return object;
}
