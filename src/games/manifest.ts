// Server-safe game metadata. Imported in .astro frontmatter (getStaticPaths,
// test pages) — must NOT touch the DOM or import the engine/game modules.
// The client-side factory mapping lives in registry.ts.

export interface GameBadge {
  id: string;
  label: string;
  source?: string;
  icon: string;
}

export interface GameMeta {
  id: string;
  title: string;
  description: string;
  /** Canvas box aspect ratio (width / height). */
  aspect: number;
  /** Options passed to the game factory. */
  options?: Record<string, unknown>;
  /** Badge awarded on win, if any. */
  badge?: GameBadge;
}

export const GAMES: GameMeta[] = [
  {
    id: 'treasure-hunt',
    title: 'Myth Match',
    description:
      'Reveal the AR icons with your phone, then click to make matching pairs.',
    aspect: 1,
    options: {
      emojis: ['🧙', '🦄', '🧜‍♀️', '🐦‍🔥', '🐉', '🎠', '🔮', '📯', '🏹', '🛡️', '🗡️'],
    },
    badge: {
      id: 'myth-match',
      label: 'myth matcher',
      source: 'Quick Distract',
      icon: '🏰',
    },
  },
];

export const getGame = (id: string): GameMeta | undefined =>
  GAMES.find(g => g.id === id);
