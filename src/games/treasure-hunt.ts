// Myth Match — an AR matching game on the shared game shell. A 4×4 grid of
// printed QR marker cards (each pinned at a slight random tilt) is the real,
// physical layer. The phone is an AR lens: hold it over the grid and every
// card's fantasy counterpart is already glowing through it over its QR — no
// scanning needed. Tap two cards to pair them; a match physically flips both
// over to a castle backing, a mismatch just deselects. Clear all eight to win.
//
// Only the match-flip animates; the QR markers otherwise stay put, each
// counterpart aligned over its card so it reads as registered.

import type { Game, GameContext, GameInput } from './engine';
import { clamp } from './engine';
import { createConfetti, type Confetti } from './effects';
import { drawEmoji, preloadEmoji } from './emoji';

export interface MatchGameOptions {
  /** Distinct emoji dealt as pairs (needs ≥ the grid's pair count). */
  emojis?: string[];
  /** Title shown on the pre-game menu card. */
  title?: string;
  /** Instructions shown on the pre-game menu card. */
  instructions?: string;
  /** Badge shown on the win screen (icon + label). */
  badge?: { icon?: string; label?: string; source?: string };
  /** Called once when the final pair is matched. Host wires up the badge here. */
  onWin?: () => void;
}

type Phase = 'menu' | 'playing' | 'won';
type CardState = 'down' | 'up' | 'matched';
interface Rect { x: number; y: number; w: number; h: number; }

interface Card {
  col: number; row: number;
  x: number; y: number;      // centre (from geometry)
  size: number;
  angle: number;             // small baked tilt, radians
  modules: boolean[];        // baked faux-QR pattern (the physical, unsolved face)
  emoji: string;
  pairId: number;
  state: CardState;
  // Virtual counterpart is always shown in AR (held at 1); drives display alpha.
  reveal: number;
  // Physical flip on a match, 0 (QR marker) → 1 (castle backing).
  flip: number;
  flp: { from: number; to: number; t: number; dur: number } | null;
  // Green-check confirmation pop, 0 → 1 (runs before the flip starts).
  settle: number;
  stl: { from: number; to: number; t: number; dur: number } | null;
}

const GRID = 4;                       // 4×4 = 16 cards = 8 pairs
const PAIRS = (GRID * GRID) / 2;
const QR_N = 11;                      // faux-QR module resolution per card
// Fantasy icons dealt as pairs — a random 8 of these fill each board.
const DEFAULT_EMOJIS = ['🧙', '🦄', '🧜‍♀️', '🐦‍🔥', '🐉', '🎠', '🔮', '📯', '🏹', '🛡️', '🗡️'];
const CARD_BACK = '🏰';               // crest on the flipped (matched) card back

const SETTLE_DUR = 0.3;              // green check pops in over this
const FLIP_DUR = 0.45;               // physical card turn-over on a match
const MISS_HOLD = 0.45;              // a mismatch stays visible this long (short)
const WIN_DELAY = 0.9;               // let the final flip finish before the win card

const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function createMatchGame(opts: MatchGameOptions = {}): Game {
  const pool = (opts.emojis ?? DEFAULT_EMOJIS).slice();
  const title = opts.title ?? 'Myth Match';
  const instructions = opts.instructions ?? '';
  const badgeIcon = opts.badge?.icon ?? '🏅';
  const badgeLabel = opts.badge?.label ?? 'badge';

  let W = 0, H = 0, S = 0;
  let cards: Card[] = [];

  // Board state
  let up: Card[] = [];          // face-up, unmatched (0..1; a match clears at once)
  let matched = 0;
  let lock = false;             // input frozen only while a MISMATCH is on show
  let resolveT = 0;             // mismatch hold countdown
  let winT = 0;                 // delay between the last match and the win card

  const pointer = { x: -1, y: -1 };

  const confetti: Confetti = createConfetti();

  // A fresh mount always opens on the menu, even if the badge is already earned.
  let phase: Phase = 'menu';
  let winFired = false;
  let wonEnter = 0;             // seconds since the win card appeared (badge pop)

  // Menu / win-screen panels + their buttons (computed in geometry()).
  let menuPanel: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let wonPanel: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let startBtn: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let replayBtn: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let panelR = 0;

  // Tap gesture: the finger presses on every click.
  const TAP_DUR = 0.22;
  let tapT = 0;

  // Board placement (recomputed on resize)
  let gridX = 0, gridY = 0, cell = 0, cardSize = 0;

  // The phone scanner — a lens that frames roughly one card, following the
  // pointer. Its size is derived from the card size in geometry().
  let lensW = 0, lensH = 0;

  // ── geometry (positions/sizes only — never re-deals the board) ────────────

  function geometry(gc: GameContext) {
    W = gc.width; H = gc.height;
    S = Math.min(W, H);

    // inset from the edge so the corner cards clear the rounded stage mask
    const area = S * 0.84;
    gridX = (W - area) / 2;
    gridY = (H - area) / 2;
    cell = area / GRID;
    cardSize = cell * 0.82;

    // phone frames ~one card, with a tall phone body
    lensW = clamp(cardSize * 1.24, 92, 260);
    lensH = lensW * 1.9;

    for (const c of cards) {
      c.x = gridX + (c.col + 0.5) * cell;
      c.y = gridY + (c.row + 0.5) * cell;
      c.size = cardSize;
    }

    // menu / win panels + buttons
    panelR = S * 0.045;
    const btnW = clamp(S * 0.42, 130, 260);
    const btnH = clamp(S * 0.11, 42, 66);

    const menuW = clamp(S * 0.82, 240, 480);
    const menuH = clamp(S * 0.46, 200, 320);
    menuPanel = { x: (W - menuW) / 2, y: (H - menuH) / 2, w: menuW, h: menuH };
    startBtn = {
      x: (W - btnW) / 2,
      y: menuPanel.y + menuPanel.h - btnH - S * 0.055,
      w: btnW, h: btnH,
    };

    const wonW = clamp(S * 0.72, 220, 420);
    const wonH = clamp(S * 0.58, 230, 400);
    wonPanel = { x: (W - wonW) / 2, y: (H - wonH) / 2, w: wonW, h: wonH };
    replayBtn = {
      x: (W - btnW) / 2,
      y: wonPanel.y + wonPanel.h - btnH - S * 0.055,
      w: btnW, h: btnH,
    };
  }

  // ── deal a fresh board ────────────────────────────────────────────────────

  function dealBoard(gc: GameContext) {
    // pick PAIRS distinct icons from the pool for this board
    const bag = pool.slice();
    for (let i = bag.length - 1; i > 0; i--) {
      const j = (gc.rng() * (i + 1)) | 0;
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    const chosen = bag.slice(0, PAIRS);

    // two of each chosen icon → shuffled into the 16 slots
    const deck: number[] = [];
    for (let i = 0; i < PAIRS; i++) { deck.push(i, i); }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = (gc.rng() * (i + 1)) | 0;
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    cards = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const pairId = deck[row * GRID + col];
        cards.push({
          col, row,
          x: 0, y: 0, size: 0,
          angle: (gc.rng() * 2 - 1) * 0.07,   // ±4° of tilt
          modules: bakeModules(gc),
          emoji: chosen[pairId],
          pairId,
          state: 'down',
          reveal: 1,          // counterpart visible in AR from the start
          flip: 0,
          flp: null,
          settle: 0,
          stl: null,
        });
      }
    }

    up = [];
    matched = 0;
    lock = false;
    resolveT = 0;
    geometry(gc); // position the freshly dealt cards
  }

  // ── the real layer: printed cards (always visible) ─────────────────────────

  // A stable random QR-ish module grid: three corner finder patterns plus
  // scattered data cells. Baked once per card so the printed marker never
  // flickers frame-to-frame.
  function bakeModules(gc: GameContext): boolean[] {
    const m = new Array<boolean>(QR_N * QR_N).fill(false);
    const at = (x: number, y: number) => y * QR_N + x;
    const finders = [[0, 0], [0, QR_N - 5], [QR_N - 5, 0]];
    const inFinder = (x: number, y: number) =>
      finders.some(([fx, fy]) => x >= fx && x < fx + 5 && y >= fy && y < fy + 5);
    for (let y = 0; y < QR_N; y++) {
      for (let x = 0; x < QR_N; x++) {
        if (inFinder(x, y)) continue;
        if (gc.rng() > 0.52) m[at(x, y)] = true;
      }
    }
    for (const [fx, fy] of finders) {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const ring = x === 0 || x === 4 || y === 0 || y === 4;
          const core = x === 2 && y === 2;
          m[at(fx + x, fy + y)] = ring || core;
        }
      }
    }
    return m;
  }

  // The parchment tile + soft shadow shared by both faces, drawn at the origin.
  function drawTile(g: CanvasRenderingContext2D, size: number, r: number) {
    const x = -size / 2, y = -size / 2;
    g.save();
    g.shadowColor = 'rgba(50,42,28,0.22)';
    g.shadowBlur = S * 0.02;
    g.shadowOffsetY = S * 0.008;
    roundRectPath(g, x, y, size, size, r);
    g.fillStyle = '#f6f2e9';
    g.fill();
    g.restore();
    g.lineWidth = Math.max(1, S * 0.003);
    g.strokeStyle = 'rgba(60,50,35,0.12)';
    roundRectPath(g, x, y, size, size, r);
    g.stroke();
  }

  // Face A — the printed QR marker (an unsolved card), drawn at the origin.
  function drawQrFace(g: CanvasRenderingContext2D, card: Card) {
    const size = card.size, r = size * 0.12;
    const x = -size / 2, y = -size / 2;
    drawTile(g, size, r);

    const pad = size * 0.12;
    const cs = (size - pad * 2) / QR_N;
    const ox = x + pad, oy = y + pad;
    g.fillStyle = '#332f28';
    for (let my = 0; my < QR_N; my++) {
      for (let mx = 0; mx < QR_N; mx++) {
        if (!card.modules[my * QR_N + mx]) continue;
        g.fillRect(ox + mx * cs, oy + my * cs, cs + 0.5, cs + 0.5);
      }
    }
    // punch the finder cores back to paper for the classic bullseye read
    const finders = [[0, 0], [0, QR_N - 5], [QR_N - 5, 0]];
    g.fillStyle = '#f6f2e9';
    for (const [fx, fy] of finders) {
      g.fillRect(ox + (fx + 1) * cs, oy + (fy + 1) * cs, cs, cs);
      g.fillRect(ox + (fx + 3) * cs, oy + (fy + 1) * cs, cs, cs);
      g.fillRect(ox + (fx + 1) * cs, oy + (fy + 3) * cs, cs, cs);
      g.fillRect(ox + (fx + 3) * cs, oy + (fy + 3) * cs, cs, cs);
    }
  }

  // Face B — the castle backing shown once a card is matched, drawn at the
  // origin: an arcane double frame, corner pips and a centred castle crest.
  function drawCastleFace(g: CanvasRenderingContext2D, size: number) {
    const r = size * 0.12, x = -size / 2, y = -size / 2;
    drawTile(g, size, r);

    // arcane inner frame — a double rule inset from the edge
    const in1 = size * 0.1;
    g.lineWidth = Math.max(1.5, S * 0.004);
    g.strokeStyle = 'rgba(120,90,175,0.55)';
    roundRectPath(g, x + in1, y + in1, size - in1 * 2, size - in1 * 2, r * 0.65);
    g.stroke();
    const in2 = size * 0.135;
    g.lineWidth = Math.max(1, S * 0.002);
    g.strokeStyle = 'rgba(120,90,175,0.3)';
    roundRectPath(g, x + in2, y + in2, size - in2 * 2, size - in2 * 2, r * 0.5);
    g.stroke();

    // corner pips sitting on the inner frame corners
    g.fillStyle = 'rgba(120,90,175,0.5)';
    const pip = size * 0.5 - in1;
    const pr = Math.max(1.5, size * 0.022);
    for (const sxp of [-1, 1]) for (const syp of [-1, 1]) {
      const cx = sxp * pip, cy = syp * pip;
      g.beginPath();
      g.moveTo(cx, cy - pr);
      g.lineTo(cx + pr, cy);
      g.lineTo(cx, cy + pr);
      g.lineTo(cx - pr, cy);
      g.closePath();
      g.fill();
    }

    // centred castle crest
    g.globalAlpha = 0.88;
    drawEmoji(g, CARD_BACK, 0, size * 0.02, size * 0.5);
    g.globalAlpha = 1;
  }

  // One physical card: tilted by its baked angle, and mid-match it turns on its
  // vertical axis (a horizontal squash) — QR on the front half of the turn,
  // castle backing on the back half — so a solved pair visibly flips over in the
  // real world.
  function drawPhysicalCard(g: CanvasRenderingContext2D, card: Card) {
    const sx = Math.abs(Math.cos(card.flip * Math.PI)); // 1 → 0 → 1 across the flip
    g.save();
    g.translate(card.x, card.y);
    g.rotate(card.angle);
    g.scale(Math.max(0.0001, sx), 1);
    if (card.flip > 0.5) drawCastleFace(g, card.size);
    else drawQrFace(g, card);
    g.restore();
  }

  // ── the virtual layer: AR counterparts registered on the markers ───────────

  // A card's virtual counterpart, always visible through the phone: a framed
  // panel + creature registered over the QR. A QR-facing card carries a
  // travelling scan band; a selected card gets a bold, near-opaque panel;
  // matched counterparts wear green + a tick.
  function drawVirtual(g: CanvasRenderingContext2D, card: Card, now = 0) {
    if (card.reveal <= 0.001) return;
    // Once the card turns past its edge, its AR counterpart has flipped away
    // with it — draw nothing; the physical castle backing shows through instead.
    if (card.flip >= 0.5) return;
    const fsx = Math.abs(Math.cos(card.flip * Math.PI)); // squash as it flips over
    const size = card.size, r = size * 0.12;
    const isMatched = card.state === 'matched';
    const isSelected = card.state === 'up';
    const rim = isMatched ? 'rgba(60,170,110,0.95)'
      : isSelected ? 'rgba(150,95,225,1)'
      : 'rgba(150,110,210,0.8)';

    g.save();
    g.translate(card.x, card.y);
    g.rotate(card.angle);
    g.scale(Math.max(0.0001, fsx), 1);       // the counterpart flips with the card

    // panel backing — near-opaque when selected so the creature reads crisply,
    // otherwise translucent so the QR shows through underneath
    roundRectPath(g, -size / 2, -size / 2, size, size, r);
    const tile = g.createLinearGradient(0, -size / 2, 0, size / 2);
    if (isMatched) {
      // hold the same near-opaque level a card had while selected (#8)
      tile.addColorStop(0, 'rgba(216,244,224,0.97)');
      tile.addColorStop(1, 'rgba(184,226,196,0.97)');
    } else if (isSelected) {
      tile.addColorStop(0, 'rgba(243,238,255,0.97)');
      tile.addColorStop(1, 'rgba(226,216,251,0.97)');
    } else {
      tile.addColorStop(0, 'rgba(224,213,250,0.78)');
      tile.addColorStop(1, 'rgba(204,189,243,0.78)');
    }
    g.fillStyle = tile;
    g.fill();

    // per-card scan sweep — a light band travelling over the QR-facing card
    if (!isMatched && now) {
      const ph = (now * 0.5 + card.col * 0.37 + card.row * 0.19) % 1;
      const sy = -size / 2 + ph * size;
      g.save();
      roundRectPath(g, -size / 2, -size / 2, size, size, r);
      g.clip();
      const band = g.createLinearGradient(0, sy - size * 0.14, 0, sy + size * 0.14);
      band.addColorStop(0, 'rgba(200,215,255,0)');
      band.addColorStop(0.5, 'rgba(205,220,255,0.28)');
      band.addColorStop(1, 'rgba(200,215,255,0)');
      g.fillStyle = band;
      g.fillRect(-size / 2, sy - size * 0.14, size, size * 0.28);
      g.restore();
    }

    // registration outline — same weight as the green victory rim; a selected
    // card reads through its brighter colour + solid panel + soft glow
    g.lineWidth = Math.max(1.5, S * 0.005);
    g.strokeStyle = rim;
    if (isSelected) { g.shadowColor = 'rgba(150,110,210,0.55)'; g.shadowBlur = size * 0.1; }
    roundRectPath(g, -size / 2, -size / 2, size, size, r);
    g.stroke();
    g.shadowColor = 'transparent';
    g.shadowBlur = 0;

    // the creature — fully opaque
    g.save();
    g.shadowColor = 'rgba(70,40,110,0.28)';
    g.shadowBlur = size * 0.06;
    g.shadowOffsetY = size * 0.02;
    drawEmoji(g, card.emoji, 0, size * 0.02, size * 0.68);
    g.restore();

    // green check badge — pops in as the match is confirmed (before the flip)
    if (isMatched && card.settle > 0.01) {
      const pop = easeOutBack(clamp(card.settle, 0, 1));
      const bx = size * 0.28, by = -size * 0.28, br = size * 0.13;
      g.save();
      g.globalAlpha = Math.min(1, card.settle * 2);
      g.translate(bx, by);
      g.scale(pop, pop);
      g.beginPath();
      g.arc(0, 0, br, 0, Math.PI * 2);
      g.fillStyle = 'rgba(60,170,110,0.95)';
      g.fill();
      g.strokeStyle = '#fff';
      g.lineWidth = Math.max(1.5, size * 0.03);
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-br * 0.45, 0);
      g.lineTo(-br * 0.1, br * 0.4);
      g.lineTo(br * 0.5, -br * 0.4);
      g.stroke();
      g.restore();
    }
    g.restore();
  }

  // AR targeting brackets around the face-down card under the pointer — the
  // "what you'd scan" affordance. Part of the virtual layer (drawn through the
  // phone only).
  function drawHoverTarget(g: CanvasRenderingContext2D, card: Card) {
    const h = card.size / 2 + S * 0.012;
    const len = card.size * 0.22;
    g.save();
    g.translate(card.x, card.y);
    g.rotate(card.angle);
    g.strokeStyle = 'rgba(150,110,210,0.9)';
    g.lineWidth = Math.max(2, S * 0.006);
    g.lineCap = 'round';
    const corner = (cx: number, cy: number, dx: number, dy: number) => {
      g.beginPath();
      g.moveTo(cx, cy + dy * len);
      g.lineTo(cx, cy);
      g.lineTo(cx + dx * len, cy);
      g.stroke();
    };
    corner(-h, -h, 1, 1);
    corner(h, -h, -1, 1);
    corner(-h, h, 1, -1);
    corner(h, h, -1, -1);
    g.restore();
  }

  // ── the phone scanner ───────────────────────────────────────────────────────

  // The phone body: a dark rounded bezel around the screen, with a top notch.
  function drawPhoneFrame(g: CanvasRenderingContext2D, r: Rect) {
    // stroke whose INNER edge sits exactly on the screen rect — no gap to the rim
    const lw = S * 0.014;
    const inset = lw / 2;
    g.save();
    roundRectPath(g, r.x - inset, r.y - inset, r.w + inset * 2, r.h + inset * 2,
      r.w * 0.12 + inset);
    g.lineWidth = lw;
    g.strokeStyle = '#15151a';
    g.stroke();
    // top speaker notch, tucked against the inside of the top rim
    g.fillStyle = '#15151a';
    roundRectPath(g, r.x + r.w / 2 - r.w * 0.09, r.y - inset * 0.2,
      r.w * 0.18, lw * 0.62, lw * 0.3);
    g.fill();
    g.restore();
  }

  // Expanding ring pulse from screen centre on each scan tap.
  function drawScanPulse(g: CanvasRenderingContext2D, r: Rect) {
    const p = 1 - tapT / TAP_DUR;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    const rad = S * 0.02 + p * S * 0.07;
    g.save();
    g.globalAlpha = (1 - p) * 0.8;
    g.strokeStyle = 'rgba(150,110,210,0.9)';
    g.lineWidth = Math.max(1.5, S * 0.006);
    g.beginPath();
    g.arc(cx, cy, rad, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }

  // The pointer-finger emoji sitting ON the phone (over the bezel, in the phone's
  // own tilted frame). It's big — roughly phone-proportioned — angled ~30° so it
  // leaks off the lower-right rim, and it lunges in toward the centre on a tap.
  function drawFinger(g: CanvasRenderingContext2D, r: Rect) {
    const press = tapT > 0 ? Math.sin((1 - tapT / TAP_DUR) * Math.PI) : 0;
    const es = r.w * 1.15;
    const rot = -0.5; // ~30° counter-clockwise: fingertip up-left, hand off lower-right
    // fingertip rests a touch up-right of the phone centre
    const fx = es * 0.375 - press * es * 0.05;
    const fy = es * 0.27 + press * es * 0.05;
    g.save();
    g.translate(fx, fy);
    g.rotate(rot);
    drawEmoji(g, '👆', 0, 0, es);
    g.restore();
  }

  // The currently-selected creature — a chip near the TOP of the screen (the
  // hand covers the bottom), a touch smaller than before.
  function drawSelectedTag(g: CanvasRenderingContext2D, r: Rect) {
    if (!up.length) return;
    const es = S * 0.043;
    const cx = r.x + r.w / 2;
    const cr = es * 0.75;
    const cyc = r.y + cr + S * 0.022;
    g.save();
    g.beginPath();
    g.arc(cx, cyc, cr, 0, Math.PI * 2);
    g.fillStyle = 'rgba(24,24,30,0.7)';
    g.fill();
    drawEmoji(g, up[0].emoji, cx, cyc, es * 1.15);
    g.restore();
  }

  // The whole phone rig. The screen is a window into the AR world: it tilts with
  // a subtle sweep as it moves across the board (so it reads as being swung
  // around), but the creatures behind it stay pinned to their real cards. The
  // bezel and finger ride on top, in the tilt.
  function drawPhone(
    g: CanvasRenderingContext2D, now: number, aim: Card | null, reduced: boolean,
  ) {
    if (pointer.x < 0) return;
    const cx = pointer.x, cy = pointer.y;
    const sweep = reduced ? 0 : (pointer.x / W - 0.5) * 0.24; // ±~7° across the board
    const lr: Rect = { x: -lensW / 2, y: -lensH / 2, w: lensW, h: lensH };

    g.save();
    g.translate(cx, cy);
    g.rotate(sweep);

    // the screen — a tilted window; clip to it
    g.save();
    roundRectPath(g, lr.x, lr.y, lr.w, lr.h, lr.w * 0.12);
    g.clip();

    // AR counterparts, aligned to the real cards → drop back to world space
    g.save();
    g.rotate(-sweep);
    g.translate(-cx, -cy);
    for (const c of cards) drawVirtual(g, c, reduced ? 0 : now);
    if (aim) {
      g.save();
      g.translate(aim.x, aim.y);
      g.rotate(aim.angle);
      roundRectPath(g, -aim.size / 2, -aim.size / 2, aim.size, aim.size, aim.size * 0.12);
      g.fillStyle = 'rgba(160,120,220,0.16)';
      g.fill();
      g.restore();
      drawHoverTarget(g, aim);
    }
    g.restore();

    // on-screen UI, in the phone's own tilted frame
    if (!reduced && tapT > 0) drawScanPulse(g, lr);
    drawSelectedTag(g, lr);
    g.restore(); // drop the clip

    drawPhoneFrame(g, lr);             // bezel, tilts with the phone
    if (!reduced) drawFinger(g, lr);   // finger on top, tilts with the phone
    g.restore();
  }

  // ── menu / win overlays ───────────────────────────────────────────────────

  const UI_FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
  const LABEL_FONT = "'Source Code Pro', ui-monospace, 'SFMono-Regular', monospace";

  function wrapText(g: CanvasRenderingContext2D, text: string, maxW: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (g.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function dim(g: CanvasRenderingContext2D) {
    g.fillStyle = 'rgba(17,17,17,0.42)';
    g.fillRect(0, 0, W, H);
  }

  function drawPanel(g: CanvasRenderingContext2D, p: Rect) {
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.18)';
    g.shadowBlur = S * 0.05;
    g.shadowOffsetY = S * 0.015;
    roundRectPath(g, p.x, p.y, p.w, p.h, panelR);
    g.fillStyle = '#ffffff';
    g.fill();
    g.restore();
    g.lineWidth = Math.max(1, S * 0.0035);
    g.strokeStyle = 'rgba(0,0,0,0.10)';
    roundRectPath(g, p.x, p.y, p.w, p.h, panelR);
    g.stroke();
  }

  function drawButton(g: CanvasRenderingContext2D, b: Rect, label: string, hover: boolean) {
    roundRectPath(g, b.x, b.y, b.w, b.h, b.h * 0.32);
    g.fillStyle = hover ? '#333333' : '#111111';
    g.fill();
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const fs = b.h * 0.3;
    g.font = `500 ${fs}px ${LABEL_FONT}`;  // lowercase mono, like the site's CTAs
    (g as any).letterSpacing = `${fs * 0.04}px`; // --label-tracking-tight
    g.fillText(label, b.x + b.w / 2, b.y + b.h / 2 + b.h * 0.02);
    (g as any).letterSpacing = '0px';
  }

  function drawMenu(g: CanvasRenderingContext2D, hover: boolean) {
    dim(g);
    drawPanel(g, menuPanel);
    const p = menuPanel;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    // title — lowercase Inter with tight tracking, like the site's .ph-title
    g.fillStyle = '#111111';
    const ts = Math.max(18, S * 0.058);
    g.font = `700 ${ts}px ${UI_FONT}`;
    (g as any).letterSpacing = `${-ts * 0.03}px`;
    g.fillText(title.toLowerCase(), W / 2, p.y + p.h * 0.24);
    (g as any).letterSpacing = '0px';

    // instructions sit just under the title, close to the button (tight rhythm)
    g.fillStyle = '#666666';
    const bodySize = Math.max(12, S * 0.032);
    g.font = `400 ${bodySize}px ${UI_FONT}`;
    const lines = wrapText(g, instructions, p.w - S * 0.14);
    const lineH = bodySize * 1.45;
    let ty = p.y + p.h * 0.46 - ((lines.length - 1) * lineH) / 2;
    for (const line of lines) { g.fillText(line, W / 2, ty); ty += lineH; }

    drawButton(g, startBtn, 'start', hover);
  }

  function drawWon(g: CanvasRenderingContext2D, hover: boolean) {
    dim(g);
    drawPanel(g, wonPanel);
    const p = wonPanel;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    // the earned badge — same chip as the sidebar rack (grey surface + border),
    // popped in on arrival (#8/#13/#14)
    const pop = easeOutBack(clamp(wonEnter / 0.4, 0, 1));
    const br = S * 0.068;
    g.save();
    g.translate(W / 2, p.y + p.h * 0.27);
    g.scale(pop, pop);
    g.beginPath();
    g.arc(0, 0, br, 0, Math.PI * 2);
    g.fillStyle = '#f7f7f7';               // --color-surface
    g.fill();
    g.lineWidth = Math.max(1, S * 0.003);
    g.strokeStyle = '#e0e0e0';             // --color-border
    g.stroke();
    drawEmoji(g, badgeIcon, 0, 0, br * 1.15);
    g.restore();

    // heading — lowercase Inter, tight tracking
    g.fillStyle = '#111111';
    const hs = Math.max(16, S * 0.05);
    g.font = `700 ${hs}px ${UI_FONT}`;
    (g as any).letterSpacing = `${-hs * 0.03}px`;
    g.fillText('all matched', W / 2, p.y + p.h * 0.5);
    (g as any).letterSpacing = '0px';

    // badge name — lowercase mono, muted, like a section label
    g.fillStyle = '#666666';
    const ls = Math.max(10, S * 0.026);
    g.font = `500 ${ls}px ${LABEL_FONT}`;
    (g as any).letterSpacing = `${ls * 0.04}px`;
    g.fillText(`${badgeLabel.toLowerCase()} unlocked`, W / 2, p.y + p.h * 0.62);
    (g as any).letterSpacing = '0px';

    drawButton(g, replayBtn, 'replay', hover);
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  const inRect = (
    px: number, py: number, rx: number, ry: number, rw: number, rh: number,
  ) => px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;

  function cardAt(px: number, py: number): Card | undefined {
    return cards.find(c =>
      Math.abs(px - c.x) <= c.size / 2 && Math.abs(py - c.y) <= c.size / 2);
  }

  // Flip a matched card's physical face over to the castle backing (0 → 1).
  function startFlip(card: Card, reduced: boolean) {
    if (reduced) { card.flip = 1; card.flp = null; return; }
    card.flp = { from: card.flip, to: 1, t: 0, dur: FLIP_DUR };
  }

  // Pop the green check in (0 → 1) as a match is confirmed, before the flip.
  function startSettle(card: Card, reduced: boolean) {
    if (reduced) { card.settle = 1; card.stl = null; return; }
    card.stl = { from: card.settle, to: 1, t: 0, dur: SETTLE_DUR };
  }

  // Select the tapped card; when a second is up, judge the pair.
  function scan(card: Card, gc: GameContext) {
    card.state = 'up';
    up.push(card);
    if (up.length < 2) return;

    if (up[0].pairId === up[1].pairId) {
      // MATCH — confirm with the green check and free the phone immediately;
      // each card settles then flips on its own timer (see update), no lock.
      for (const c of up) { c.state = 'matched'; startSettle(c, gc.reducedMotion); }
      up = [];
      matched += 1;
      if (matched >= PAIRS) winT = WIN_DELAY;
    } else {
      // MISMATCH — hold both on show briefly, then deselect (input frozen).
      lock = true;
      resolveT = MISS_HOLD;
    }
  }

  // Only mismatches reach here now — release the pair back to face-up QR.
  function resolvePair() {
    for (const c of up) c.state = 'down';
    up = [];
    lock = false;
  }

  function enterWon(gc: GameContext) {
    phase = 'won';
    wonEnter = 0;
    if (!winFired) { winFired = true; opts.onWin?.(); }
    if (!gc.reducedMotion) confetti.burst(W / 2, H * 0.36, 130, S);
  }

  // `fresh` reshuffles the board; the first play reuses the board dealt on
  // mount (which the menu is already showing) so the QR cards don't jump.
  function startGame(gc: GameContext, fresh: boolean) {
    phase = 'playing';
    if (fresh) dealBoard(gc);
    winT = 0;
    tapT = 0; // don't let the Start click fire a phantom finger-tap (#3)
    // the phone spawns wherever the pointer already is (the Start tap); only
    // fall back to centre if the pointer was never placed.
    if (pointer.x < 0) { pointer.x = W / 2; pointer.y = H / 2; }
  }

  // ── Game interface ────────────────────────────────────────────────────────

  return {
    init(gc) {
      preloadEmoji();
      dealBoard(gc);
    },

    resize(_w, _h, gc) {
      geometry(gc); // keep the in-progress board; just re-place it
    },

    update(dt, gc) {
      if (tapT > 0) tapT = Math.max(0, tapT - dt);
      confetti.update(dt);
      if (phase === 'won') wonEnter += dt;

      for (const c of cards) {
        if (c.flp) {
          c.flp.t += c.flp.dur > 0 ? dt / c.flp.dur : 1;
          const k = Math.min(1, c.flp.t);
          c.flip = c.flp.from + (c.flp.to - c.flp.from) * k;
          if (c.flp.t >= 1) { c.flip = c.flp.to; c.flp = null; }
        }
        if (c.stl) {
          c.stl.t += c.stl.dur > 0 ? dt / c.stl.dur : 1;
          const k = Math.min(1, c.stl.t);
          c.settle = c.stl.from + (c.stl.to - c.stl.from) * k;
          if (c.stl.t >= 1) { c.settle = c.stl.to; c.stl = null; }
        }
        // once the green check has settled, turn the card over — decoupled from
        // input so the player can keep matching while it flips
        if (c.state === 'matched' && c.settle >= 1 && c.flip === 0 && !c.flp) {
          startFlip(c, gc.reducedMotion);
        }
      }

      if (resolveT > 0) {
        resolveT -= dt;
        if (resolveT <= 0) resolvePair();
      }
      if (winT > 0) {
        winT -= dt;
        if (winT <= 0) enterWon(gc);
      }
    },

    draw(gc, _alpha) {
      const g = gc.ctx;

      // warm wall with a soft pool of light
      const wash = g.createRadialGradient(W / 2, H / 2, S * 0.1, W / 2, H / 2, S * 0.8);
      wash.addColorStop(0, '#efeae0');
      wash.addColorStop(1, '#ddd6c8');
      g.fillStyle = wash;
      g.fillRect(0, 0, W, H);

      // real layer: the printed cards, always visible
      for (const c of cards) drawPhysicalCard(g, c);

      if (phase === 'menu') {
        const over = inRect(pointer.x, pointer.y, startBtn.x, startBtn.y, startBtn.w, startBtn.h);
        gc.canvas.style.cursor = over ? 'pointer' : 'default';
        drawMenu(g, over);
        return;
      }

      if (phase === 'won') {
        const over = inRect(pointer.x, pointer.y, replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h);
        gc.canvas.style.cursor = over ? 'pointer' : 'default';
        drawWon(g, over);
        confetti.draw(g); // celebratory burst, over the win card
        return;
      }

      // playing — aim the phone; brackets frame the selectable card under it.
      // The virtual layer (all creatures + reticle) is drawn inside the phone.
      gc.canvas.style.cursor = 'none';
      const aim = !lock ? cardAt(pointer.x, pointer.y) : undefined;
      const scannable = aim && aim.state === 'down' ? aim : null;
      drawPhone(g, gc.reducedMotion ? 0 : gc.now, scannable, gc.reducedMotion);
    },

    onInput(e: GameInput, gc) {
      if (e.type === 'move') {
        pointer.x = clamp(e.x, 0, W);
        pointer.y = clamp(e.y, 0, H);
        return;
      }
      if (e.type !== 'down') return;

      pointer.x = clamp(e.x, 0, W);
      pointer.y = clamp(e.y, 0, H);
      tapT = TAP_DUR;

      if (phase === 'menu') {
        if (inRect(e.x, e.y, startBtn.x, startBtn.y, startBtn.w, startBtn.h)) startGame(gc, false);
        return;
      }
      if (phase === 'won') {
        if (inRect(e.x, e.y, replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h)) startGame(gc, true);
        return;
      }

      // playing — select a card, or tap your current selection again to release
      // it (ignore taps while a mismatch is still on show)
      if (lock) return;
      const card = cardAt(e.x, e.y);
      if (!card) return;
      if (card.state === 'up') {
        card.state = 'down';
        up = up.filter(c => c !== card);
        return;
      }
      if (card.state === 'down') scan(card, gc);
    },
  };
}
