// Shared emoji-as-SVG sprites for the Canvas2D games.
//
// The system emoji font renders differently on every platform; these are the
// Fluent Emoji (microsoft/fluentui-emoji, MIT) Color SVGs, bundled under
// /public/games/emoji so every visitor sees the same art. Each SVG is
// rasterised once into an offscreen canvas, then blitted per frame (fast).
//
// drawEmoji() falls back to the platform glyph until its sprite has loaded.

const BASE = '/games/emoji/';
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const RASTER = 256; // offscreen sprite resolution

// Exact emoji literals → sprite basename. Keep keys byte-identical to the
// strings the games pass (variation selectors / ZWJ included).
const FILES: Record<string, string> = {
  '🧙': 'mage',
  '🦄': 'unicorn',
  '🧜‍♀️': 'mermaid',
  '🐦‍🔥': 'phoenix',
  '🐉': 'dragon',
  '🎠': 'carousel-horse',
  '🔮': 'crystal-ball',
  '📯': 'postal-horn',
  '🏹': 'bow-and-arrow',
  '🛡️': 'shield',
  '🗡️': 'dagger',
  '🏰': 'castle',
  '👆': 'finger',
};

const sprites = new Map<string, HTMLCanvasElement>();
const pending = new Set<string>();

function ensure(emoji: string): void {
  if (sprites.has(emoji) || pending.has(emoji)) return;
  const file = FILES[emoji];
  if (!file || typeof Image === 'undefined') return;
  pending.add(emoji);
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = RASTER;
    c.height = RASTER;
    const cx = c.getContext('2d');
    if (cx) cx.drawImage(img, 0, 0, RASTER, RASTER);
    sprites.set(emoji, c);
    pending.delete(emoji);
  };
  img.onerror = () => pending.delete(emoji);
  img.src = BASE + file + '.svg';
}

/** Warm the sprite cache (call once on the client). */
export function preloadEmoji(): void {
  for (const e of Object.keys(FILES)) ensure(e);
}

/** The bundled SVG url for an emoji, or null if we don't have one (HTML use). */
export function emojiSvgUrl(emoji: string): string | null {
  const f = FILES[emoji];
  return f ? BASE + f + '.svg' : null;
}

/**
 * Draw `emoji` centred at (cx, cy) filling a `box`×`box` square. Uses the SVG
 * sprite when ready, otherwise the platform glyph at a matching size. Respects
 * the context's current shadow/alpha.
 */
export function drawEmoji(
  g: CanvasRenderingContext2D,
  emoji: string,
  cx: number,
  cy: number,
  box: number,
): void {
  ensure(emoji);
  const s = sprites.get(emoji);
  if (s) {
    g.drawImage(s, cx - box / 2, cy - box / 2, box, box);
    return;
  }
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${box * 0.82}px ${EMOJI_FONT}`;
  g.fillText(emoji, cx, cy);
}
