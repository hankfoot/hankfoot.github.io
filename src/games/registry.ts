// Client-side registry: maps a game id to the factory that builds its Game.
// Imported only from the GameCanvas island script (never server-side), so it's
// free to pull in the engine + game modules that use browser APIs.

import type { Game } from './engine';
import { createMatchGame } from './treasure-hunt';

export type GameFactory = (opts: Record<string, unknown>) => Game;

export const REGISTRY: Record<string, GameFactory> = {
  'treasure-hunt': createMatchGame as GameFactory,
};
