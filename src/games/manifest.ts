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
    title: 'Treasure Hunt',
    description:
      'Sweep the phone lens over the AR marker to reveal the sunken chest, then click the impostor fish hiding in the gold.',
    aspect: 1,
    options: { target: '🐡', decoyCount: 120 },
    badge: {
      id: 'impostor',
      label: 'Impostor Catcher',
      source: 'Quick Distract',
      icon: '🐡',
    },
  },
];

export const getGame = (id: string): GameMeta | undefined =>
  GAMES.find(g => g.id === id);
