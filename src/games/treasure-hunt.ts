// Treasure Hunt — the "spot the impostor" easter-egg, ported to Canvas2D on the
// shared game shell. A top-down chest of gold sits on an AR marker card; you
// sweep a phone-shaped lens over it to reveal the undersea treasure, and click
// the lone impostor fish hiding in the loot to win.

import type { Game, GameContext, GameInput } from './engine';
import { clamp, pointInRect } from './engine';

export interface TreasureHuntOptions {
  /** The impostor emoji to find (also the badge icon). */
  target?: string;
  /** How many gold decoys to pack into the chest. */
  decoyCount?: number;
  /** Title shown on the pre-game menu card. */
  title?: string;
  /** Instructions shown on the pre-game menu card. */
  instructions?: string;
  /** Called once when the impostor is caught. Host wires up the badge here. */
  onWin?: () => void;
}

type Phase = 'menu' | 'playing' | 'won';
interface Rect { x: number; y: number; w: number; h: number; }

interface Coin { x: number; y: number; emoji: string; size: number; rot: number; }
interface Bubble { x: number; y: number; r: number; speed: number; phase: number; }

const DECOYS = ['🪙', '🪙', '🪙', '🪙', '💰', '💰', '💎', '💎', '👑', '💍', '🏆', '🥇'];
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

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

export function createTreasureHunt(opts: TreasureHuntOptions = {}): Game {
  const target = opts.target ?? '🐡';
  const decoyCount = opts.decoyCount ?? 120;
  const title = opts.title ?? 'Treasure Hunt';
  const instructions = opts.instructions ?? '';

  let W = 0, H = 0, S = 0;
  let card = { x: 0, y: 0, w: 0, h: 0, r: 0 };
  let chest = { x: 0, y: 0, w: 0, h: 0, r: 0, border: 0 };
  let coins: Coin[] = [];
  let impostor = { x: 0, y: 0, size: 0 };
  let bubbles: Bubble[] = [];

  let scene: HTMLCanvasElement | null = null; // pre-rendered static treasure
  let room: HTMLCanvasElement | null = null;  // pre-rendered "naked eye" surface

  const lens = { x: 0, y: 0, w: 0, h: 0 };
  const pointer = { x: 0, y: 0, active: false };

  // A fresh mount always opens on the menu, even if the badge is already earned.
  let phase: Phase = 'menu';
  let winFired = false;

  // Menu / win-screen panels + their buttons (computed in layout()).
  let menuPanel: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let wonPanel: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let startBtn: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let replayBtn: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let panelR = 0;

  // Tap gesture: the finger at the phone's centre presses on every click.
  const TAP_DUR = 0.22;
  let tapT = 0;

  // ── layout + pre-render ───────────────────────────────────────────────────

  function layout(gc: GameContext) {
    W = gc.width; H = gc.height;
    S = Math.min(W, H);

    const side = S * 0.92;
    card = { x: (W - side) / 2, y: (H - side) / 2, w: side, h: side, r: S * 0.03 };

    const cw = side * 0.86;
    const ch = side * 0.66;
    chest = {
      x: card.x + (side - cw) / 2,
      y: card.y + (side - ch) / 2 + side * 0.04,
      w: cw, h: ch,
      r: S * 0.035,
      border: S * 0.028,
    };

    lens.w = clamp(S * 0.3, 90, 240);
    lens.h = lens.w * 1.9;
    if (!pointer.active) { lens.x = W / 2; lens.y = H / 2; }

    // menu / win panels + buttons
    panelR = S * 0.045;
    const btnW = clamp(S * 0.42, 130, 260);
    const btnH = clamp(S * 0.11, 42, 66);

    const menuW = clamp(S * 0.82, 240, 480);
    const menuH = clamp(S * 0.62, 220, 400);
    menuPanel = { x: (W - menuW) / 2, y: (H - menuH) / 2, w: menuW, h: menuH };
    startBtn = {
      x: (W - btnW) / 2,
      y: menuPanel.y + menuPanel.h - btnH - S * 0.055,
      w: btnW, h: btnH,
    };

    const wonW = clamp(S * 0.72, 220, 420);
    const wonH = clamp(S * 0.5, 190, 340);
    wonPanel = { x: (W - wonW) / 2, y: (H - wonH) / 2, w: wonW, h: wonH };
    replayBtn = {
      x: (W - btnW) / 2,
      y: wonPanel.y + wonPanel.h - btnH - S * 0.055,
      w: btnW, h: btnH,
    };

    generateLoot(gc);
    generateBubbles(gc);
    renderRoom(gc);
    renderScene(gc);
  }

  function generateLoot(gc: GameContext) {
    const inX = chest.x + chest.border;
    const inY = chest.y + chest.border;
    const inW = chest.w - chest.border * 2;
    const inH = chest.h - chest.border * 2;
    const size = S * 0.085;

    coins = [];
    for (let i = 0; i < decoyCount; i++) {
      coins.push({
        x: inX + gc.rng() * inW,
        y: inY + gc.rng() * inH,
        emoji: DECOYS[(gc.rng() * DECOYS.length) | 0],
        size: size * (0.85 + gc.rng() * 0.3),
        rot: (gc.rng() - 0.5) * 0.7,
      });
    }
    // impostor sits within the pile, kept off the very edges so it's findable
    impostor = {
      x: inX + inW * (0.2 + gc.rng() * 0.6),
      y: inY + inH * (0.2 + gc.rng() * 0.6),
      size: size * 1.05,
    };
  }

  function generateBubbles(gc: GameContext) {
    bubbles = [];
    for (let i = 0; i < 18; i++) {
      bubbles.push({
        x: card.x + gc.rng() * card.w,
        y: gc.rng(),                       // 0..1 vertical progress
        r: S * (0.006 + gc.rng() * 0.014),
        speed: 0.03 + gc.rng() * 0.06,
        phase: gc.rng() * Math.PI * 2,
      });
    }
  }

  // A fresh offscreen canvas at device resolution, drawn in logical coords.
  function offscreen(): { c: HTMLCanvasElement; g: CanvasRenderingContext2D; dpr: number } {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const c = document.createElement('canvas');
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    return { c, g, dpr };
  }

  // The plain surface you see with the naked eye: a warm wall + a printed QR
  // marker card. The treasure only exists "in AR", revealed through the lens.
  function renderRoom(gc: GameContext) {
    const { c, g } = offscreen();
    g.fillStyle = '#e9e6df';
    g.fillRect(0, 0, W, H);

    // marker card
    roundRectPath(g, card.x, card.y, card.w, card.h, card.r);
    g.fillStyle = '#f3efe6';
    g.fill();
    g.strokeStyle = 'rgba(60,50,35,0.12)';
    g.lineWidth = Math.max(1, S * 0.004);
    g.stroke();

    // faux-QR modules
    const N = 21, quiet = 2, mods = N + quiet * 2;
    const pad = card.w * 0.12;
    const inner = card.w - pad * 2;
    const cell = inner / mods;
    const ox = card.x + pad + quiet * cell;
    const oy = card.y + pad + quiet * cell;
    g.fillStyle = '#3d3a34';
    const finders = [[0, 0], [0, N - 7], [N - 7, 0]];
    const inFinder = (x: number, y: number) =>
      finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (inFinder(x, y) || gc.rng() > 0.56) continue;
        g.fillRect(ox + x * cell, oy + y * cell, cell + 0.5, cell + 0.5);
      }
    }
    for (const [fx, fy] of finders) {
      g.fillStyle = '#3d3a34';
      g.fillRect(ox + fx * cell, oy + fy * cell, cell * 7, cell * 7);
      g.fillStyle = '#f3efe6';
      g.fillRect(ox + (fx + 1) * cell, oy + (fy + 1) * cell, cell * 5, cell * 5);
      g.fillStyle = '#3d3a34';
      g.fillRect(ox + (fx + 2) * cell, oy + (fy + 2) * cell, cell * 3, cell * 3);
    }
    room = c;
  }

  // The AR treasure scene: sandy seabed, an open chest packed with gold, and the
  // impostor hiding in it. Static; the animated water/bubbles are drawn on top.
  function renderScene(gc: GameContext) {
    const { c, g } = offscreen();
    g.save();
    roundRectPath(g, card.x, card.y, card.w, card.h, card.r);
    g.clip();

    // sandy seabed
    const sand = g.createRadialGradient(
      W / 2, card.y + card.h * 0.4, S * 0.1,
      W / 2, card.y + card.h * 0.4, S * 0.7,
    );
    sand.addColorStop(0, '#ecd7a2');
    sand.addColorStop(0.55, '#d8bf88');
    sand.addColorStop(1, '#bda368');
    g.fillStyle = sand;
    g.fillRect(card.x, card.y, card.w, card.h);

    // irregular sand flecks (jittered, not a grid)
    for (let i = 0; i < 260; i++) {
      const fx = card.x + gc.rng() * card.w;
      const fy = card.y + gc.rng() * card.h;
      const fr = S * (0.0025 + gc.rng() * 0.006);
      const light = gc.rng() > 0.5;
      g.fillStyle = light ? 'rgba(255,249,222,0.55)' : 'rgba(120,92,48,0.28)';
      g.beginPath();
      g.arc(fx, fy, fr, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    drawChest(g);
    drawLoot(g);
    scene = c;
  }

  function drawChest(g: CanvasRenderingContext2D) {
    const outline = Math.max(2, S * 0.008);

    // lid flipped open behind the chest — a low rounded back panel
    const lidH = chest.h * 0.42;
    const lidY = chest.y - lidH * 0.62;
    g.save();
    roundRectPath(g, chest.x, lidY, chest.w, lidH, chest.r);
    const wood = g.createLinearGradient(0, lidY, 0, lidY + lidH);
    wood.addColorStop(0, '#6f4a29');
    wood.addColorStop(0.55, '#563820');
    wood.addColorStop(1, '#3c2714');
    g.fillStyle = wood;
    g.fill();
    g.lineWidth = outline;
    g.strokeStyle = '#35220f';
    g.stroke();
    g.restore();

    // chest body
    roundRectPath(g, chest.x, chest.y, chest.w, chest.h, chest.r);
    g.save();
    g.clip();
    const inner = g.createRadialGradient(
      chest.x + chest.w / 2, chest.y + chest.h * 0.34, S * 0.02,
      chest.x + chest.w / 2, chest.y + chest.h * 0.34, chest.w * 0.7,
    );
    inner.addColorStop(0, '#4a3420');
    inner.addColorStop(0.58, '#2e1f10');
    inner.addColorStop(1, '#150c04');
    g.fillStyle = inner;
    g.fillRect(chest.x, chest.y, chest.w, chest.h);
    g.restore();

    // thick wooden rim + dark toon outline
    g.lineWidth = chest.border;
    g.strokeStyle = '#5c3d22';
    roundRectPath(g, chest.x + chest.border / 2, chest.y + chest.border / 2,
      chest.w - chest.border, chest.h - chest.border, chest.r);
    g.stroke();
    g.lineWidth = outline;
    g.strokeStyle = '#35220f';
    roundRectPath(g, chest.x, chest.y, chest.w, chest.h, chest.r);
    g.stroke();

    // brass lock hanging below the front lip
    const lw = S * 0.05, lh = lw * 0.9;
    const lx = chest.x + chest.w / 2 - lw / 2;
    const ly = chest.y + chest.h - lh * 0.5;
    roundRectPath(g, lx, ly, lw, lh, lw * 0.18);
    const brass = g.createLinearGradient(0, ly, 0, ly + lh);
    brass.addColorStop(0, '#e7b968');
    brass.addColorStop(1, '#c78f36');
    g.fillStyle = brass;
    g.fill();
    g.lineWidth = outline;
    g.strokeStyle = '#35220f';
    g.stroke();
    g.fillStyle = '#35220f';
    g.beginPath();
    g.arc(lx + lw / 2, ly + lh * 0.42, lw * 0.12, 0, Math.PI * 2);
    g.fill();
  }

  function drawLoot(g: CanvasRenderingContext2D) {
    g.save();
    roundRectPath(g, chest.x + chest.border * 0.4, chest.y + chest.border * 0.4,
      chest.w - chest.border * 0.8, chest.h - chest.border * 0.8, chest.r);
    g.clip();
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    const drawEmoji = (e: string, x: number, y: number, size: number, rot: number) => {
      g.save();
      g.translate(x, y);
      g.rotate(rot);
      g.font = `${size}px ${EMOJI_FONT}`;
      g.fillText(e, 0, 0);
      g.restore();
    };

    // most coins, then the impostor, then a few coins to partly bury it
    const cut = Math.floor(coins.length * 0.9);
    for (let i = 0; i < cut; i++) {
      const c = coins[i];
      drawEmoji(c.emoji, c.x, c.y, c.size, c.rot);
    }
    drawEmoji(target, impostor.x, impostor.y, impostor.size, 0);
    for (let i = cut; i < coins.length; i++) {
      const c = coins[i];
      drawEmoji(c.emoji, c.x, c.y, c.size, c.rot);
    }
    g.restore();
  }

  // ── animated water overlay (drawn live over the treasure) ─────────────────

  function drawWater(g: CanvasRenderingContext2D, now: number) {
    // soft blue depth wash
    const wash = g.createLinearGradient(0, card.y, 0, card.y + card.h);
    wash.addColorStop(0, 'rgba(70,150,190,0.14)');
    wash.addColorStop(0.55, 'rgba(38,120,160,0.20)');
    wash.addColorStop(1, 'rgba(20,86,120,0.30)');
    g.fillStyle = wash;
    g.fillRect(card.x, card.y, card.w, card.h);

    // wide, angled, gently transparent ripple bands
    const t = now * 0.35;
    g.save();
    g.lineWidth = S * 0.02;
    g.lineCap = 'round';
    const bands = 7;
    const spacing = card.h / bands;
    for (let i = -1; i <= bands; i++) {
      const baseY = card.y + i * spacing + ((t * spacing) % spacing);
      const alpha = 0.10 + 0.06 * Math.sin(t + i);
      g.strokeStyle = `rgba(210,240,255,${alpha.toFixed(3)})`;
      g.beginPath();
      const steps = 14;
      for (let s = 0; s <= steps; s++) {
        const px = card.x + (s / steps) * card.w;
        const py = baseY
          + Math.sin(t * 1.3 + s * 0.7 + i) * spacing * 0.18
          + (px - card.x) * 0.12;                 // slight diagonal tilt
        if (s === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.stroke();
    }
    g.restore();
  }

  function drawBubbles(g: CanvasRenderingContext2D, now: number) {
    for (const b of bubbles) {
      const prog = (b.y - now * b.speed) % 1;
      const p = prog < 0 ? prog + 1 : prog;
      const by = card.y + card.h - p * card.h;
      const bx = b.x + Math.sin(now * 1.2 + b.phase) * S * 0.01;
      const grd = g.createRadialGradient(
        bx - b.r * 0.3, by - b.r * 0.3, b.r * 0.1, bx, by, b.r,
      );
      grd.addColorStop(0, 'rgba(255,255,255,0.85)');
      grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(bx, by, b.r, 0, Math.PI * 2);
      g.fill();
    }
  }

  // ── the phone lens frame ──────────────────────────────────────────────────

  function drawPhone(g: CanvasRenderingContext2D) {
    const bezel = S * 0.016;
    const ox = lens.x - lens.w / 2 - bezel;
    const oy = lens.y - lens.h / 2 - bezel;
    const ow = lens.w + bezel * 2;
    const oh = lens.h + bezel * 2;
    g.save();
    roundRectPath(g, ox, oy, ow, oh, lens.w * 0.16);
    g.lineWidth = bezel * 2;
    g.strokeStyle = '#1c1c22';
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.15)';
    g.lineWidth = Math.max(1, S * 0.003);
    g.stroke();
    // notch
    g.fillStyle = '#1c1c22';
    roundRectPath(g, lens.x - lens.w * 0.12, oy + bezel * 0.5,
      lens.w * 0.24, bezel * 1.1, bezel * 0.5);
    g.fill();
    g.restore();
  }

  // A pointing finger parked at the phone's centre — the tap reticle. Its tip
  // sits on the hit-point; it presses (up + shrink) briefly on every click.
  function drawFinger(g: CanvasRenderingContext2D, reduced: boolean) {
    const press = !reduced && tapT > 0
      ? Math.sin((1 - tapT / TAP_DUR) * Math.PI)
      : 0;
    const size = lens.w * 0.46 * (1 - press * 0.14);
    const y = lens.y + size * 0.4 - press * lens.w * 0.06;
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `${size}px ${EMOJI_FONT}`;
    g.shadowColor = 'rgba(0,0,0,0.35)';
    g.shadowBlur = size * 0.14;
    g.shadowOffsetY = size * 0.05;
    g.fillText('👆', lens.x, y);
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

  function drawCard(g: CanvasRenderingContext2D, p: Rect) {
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

  // A solid near-black pill with a tracked, uppercase mono label — echoes the
  // site's label/CTA styling.
  function drawButton(g: CanvasRenderingContext2D, b: Rect, label: string, hover: boolean) {
    roundRectPath(g, b.x, b.y, b.w, b.h, b.h * 0.32);
    g.fillStyle = hover ? '#333333' : '#111111';
    g.fill();
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `600 ${b.h * 0.32}px ${LABEL_FONT}`;
    const prev = (g as any).letterSpacing;
    (g as any).letterSpacing = `${Math.max(1, S * 0.006)}px`;
    g.fillText(label.toUpperCase(), b.x + b.w / 2, b.y + b.h / 2 + b.h * 0.02);
    (g as any).letterSpacing = prev ?? '0px';
  }

  // A pointing hand nudging the button — the same character, now inside the game.
  function drawMenuHand(g: CanvasRenderingContext2D, b: Rect, now: number, reduced: boolean) {
    const size = b.h * 1.15;
    const bob = reduced ? 0 : Math.sin(now * 3) * size * 0.06;
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `${size}px ${EMOJI_FONT}`;
    g.shadowColor = 'rgba(0,0,0,0.3)';
    g.shadowBlur = size * 0.12;
    g.fillText('👆', b.x + b.w * 0.82, b.y + b.h + size * 0.45 + bob);
    g.restore();
  }

  function drawMenu(g: CanvasRenderingContext2D, now: number, reduced: boolean, hover: boolean) {
    dim(g);
    drawCard(g, menuPanel);
    const p = menuPanel;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    g.fillStyle = '#111111';
    g.font = `600 ${S * 0.056}px ${UI_FONT}`;
    g.fillText(title, W / 2, p.y + p.h * 0.16);

    g.fillStyle = '#666666';
    const bodySize = S * 0.033;
    g.font = `400 ${bodySize}px ${UI_FONT}`;
    const lines = wrapText(g, instructions, p.w - S * 0.14);
    const lineH = bodySize * 1.4;
    let ty = p.y + p.h * 0.42 - ((lines.length - 1) * lineH) / 2;
    for (const line of lines) { g.fillText(line, W / 2, ty); ty += lineH; }

    drawButton(g, startBtn, 'Start', hover);
    drawMenuHand(g, startBtn, now, reduced);
  }

  function drawWon(g: CanvasRenderingContext2D, hover: boolean) {
    dim(g);
    drawCard(g, wonPanel);
    const p = wonPanel;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    g.font = `${S * 0.13}px ${EMOJI_FONT}`;
    g.fillText(target, W / 2, p.y + p.h * 0.26);

    g.fillStyle = '#111111';
    g.font = `600 ${S * 0.05}px ${UI_FONT}`;
    g.fillText('Caught it!', W / 2, p.y + p.h * 0.52);

    g.fillStyle = '#666666';
    g.font = `400 ${S * 0.03}px ${UI_FONT}`;
    g.fillText('Badge unlocked.', W / 2, p.y + p.h * 0.64);

    drawButton(g, replayBtn, 'Replay', hover);
  }

  // ── Game interface ────────────────────────────────────────────────────────

  function startHunt() {
    phase = 'playing';
    pointer.active = false;
    lens.x = W / 2;
    lens.y = H / 2;
  }

  return {
    init(gc) {
      layout(gc);
    },

    resize(_w, _h, gc) {
      layout(gc);
    },

    update(dt, _gc) {
      // lens follows the pointer; only the tap gesture ticks down here
      if (tapT > 0) tapT = Math.max(0, tapT - dt);
    },

    draw(gc, _alpha) {
      const g = gc.ctx;
      const now = gc.reducedMotion ? 0 : gc.now;

      if (room) g.drawImage(room, 0, 0, W, H);

      if (phase === 'menu') {
        const over = pointInRect(pointer.x, pointer.y, startBtn.x, startBtn.y, startBtn.w, startBtn.h);
        gc.canvas.style.cursor = over ? 'pointer' : 'default';
        drawMenu(g, now, gc.reducedMotion, over);
        return;
      }

      const revealTreasure = (clip: () => void) => {
        g.save();
        clip();
        g.clip();
        if (scene) g.drawImage(scene, 0, 0, W, H);
        drawWater(g, now);
        drawBubbles(g, now);
        g.restore();
      };

      if (phase === 'won') {
        const over = pointInRect(pointer.x, pointer.y, replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h);
        gc.canvas.style.cursor = over ? 'pointer' : 'default';
        revealTreasure(() => roundRectPath(g, card.x, card.y, card.w, card.h, card.r));
        drawWon(g, over);
      } else {
        gc.canvas.style.cursor = 'none'; // the phone lens is the pointer during play
        revealTreasure(() =>
          roundRectPath(g, lens.x - lens.w / 2, lens.y - lens.h / 2, lens.w, lens.h, lens.w * 0.12));
        drawPhone(g);
        drawFinger(g, gc.reducedMotion);
      }
    },

    onInput(e: GameInput, gc) {
      if (e.type === 'down') {
        if (phase === 'menu') {
          if (pointInRect(e.x, e.y, startBtn.x, startBtn.y, startBtn.w, startBtn.h)) startHunt();
          return;
        }
        if (phase === 'won') {
          if (pointInRect(e.x, e.y, replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h)) {
            generateLoot(gc); // fresh impostor position for the replay
            renderScene(gc);  // re-bake the treasure with the new layout
            startHunt();
          }
          return;
        }
        // playing — tap the finger; catch the impostor sitting under it
        tapT = TAP_DUR;
        pointer.active = true;
        pointer.x = clamp(e.x, 0, W);
        pointer.y = clamp(e.y, 0, H);
        lens.x = pointer.x;
        lens.y = pointer.y;
        const onImpostor =
          Math.abs(e.x - impostor.x) <= impostor.size / 2 &&
          Math.abs(e.y - impostor.y) <= impostor.size / 2;
        if (onImpostor) {
          phase = 'won';
          if (!winFired) { winFired = true; opts.onWin?.(); }
        }
        return;
      }

      if (e.type === 'move') {
        // Track the pointer in every phase so menu/won buttons can show hover.
        pointer.x = clamp(e.x, 0, W);
        pointer.y = clamp(e.y, 0, H);
        if (phase === 'playing') {
          pointer.active = true;
          lens.x = pointer.x;
          lens.y = pointer.y;
        }
      }
    },
  };
}
