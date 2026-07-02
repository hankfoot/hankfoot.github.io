// Client-side badge store. Persists earned badges in localStorage and
// notifies the sidebar (or anything listening) when a new one is awarded.
//
// `icon` may be an emoji ("🐚") OR a raw SVG string — consumers render it
// with innerHTML, so the store stays decoupled from how badges look.

export interface Badge {
  id: string;
  icon: string;
  label: string;
  /** Human-readable place this was earned (e.g. "Quick Distract"). */
  source?: string;
  /** Deep link back to the minigame that awarded it. */
  href?: string;
}

const KEY = 'hank-badges';
export const BADGE_EVENT = 'hank-badge-earned';
export const BADGE_RESET = 'hank-badge-reset';

export function getBadges(): Badge[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Badge[]) : [];
  } catch {
    return [];
  }
}

export function hasBadge(id: string): boolean {
  return getBadges().some(b => b.id === id);
}

/** Adds a badge if not already earned. Returns true when newly awarded. */
export function awardBadge(badge: Badge): boolean {
  if (typeof localStorage === 'undefined') return false;
  if (hasBadge(badge.id)) return false;

  const next = [...getBadges(), badge];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(BADGE_EVENT, { detail: badge }));
  return true;
}

/** Wipes every earned badge and notifies listeners to re-render. */
export function clearBadges(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(BADGE_RESET));
}
