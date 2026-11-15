// Focus mode hides the form pane, so it only makes sense while both panes share
// the screen. On the tab layout it would leave the Edit tab with nothing in it.

export const MOBILE_LAYOUT = '(max-width: 980px)';

export function focusModeFor(focusMode, isMobile) {
  return Boolean(focusMode) && !isMobile;
}
