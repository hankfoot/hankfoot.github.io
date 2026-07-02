// Shared game shell for the site's little Canvas2D games.
//
// It owns everything that every game needs but no game should re-implement:
//   • a fixed-timestep update loop (deterministic physics on any refresh rate)
//     with an interpolated render pass
//   • HiDPI/resize handling (games draw in CSS pixels, never worry about DPR)
//   • normalised pointer + keyboard input
//   • lifecycle: pause when off-screen or the tab is hidden, clean teardown
//
// A game is just an object implementing `Game`. Mount it with `mountGame`.

export interface GameContext {
  readonly ctx: CanvasRenderingContext2D;
  readonly canvas: HTMLCanvasElement;
  /** Logical (CSS-pixel) drawing size. Draw against these, not canvas.width. */
  width: number;
  height: number;
  /** Deterministic RNG seeded per-mount — same layout every run if you want. */
  readonly rng: () => number;
  /** Seconds elapsed since the game started. */
  now: number;
  /** True when the visitor prefers reduced motion — freeze ambient animation. */
  readonly reducedMotion: boolean;
}

export interface GameInput {
  type: 'down' | 'up' | 'move' | 'key';
  /** Logical canvas coordinates (CSS pixels), for pointer events. */
  x: number;
  y: number;
  /** Keyboard key for `key` events (e.g. ' ', 'ArrowUp'). */
  key?: string;
}

export interface Game {
  init(gc: GameContext): void;
  update(dt: number, gc: GameContext): void;
  /** `alpha` is the 0..1 blend between the last two fixed steps, for smoothing. */
  draw(gc: GameContext, alpha: number): void;
  onInput?(e: GameInput, gc: GameContext): void;
  resize?(width: number, height: number, gc: GameContext): void;
  destroy?(): void;
}

export interface MountOptions {
  /** Seconds per fixed update. Default 1/60. */
  fixedStep?: number;
  /** Clamp for a single frame's dt (tab-switch guard). Default 0.25s. */
  maxFrame?: number;
  /** Solid background painted before each frame. Omit to clear transparent. */
  background?: string;
  /** RNG seed for deterministic layouts. Random if omitted. */
  seed?: number;
}

export interface GameController {
  pause(): void;
  resume(): void;
  destroy(): void;
}

// ── math + collision utilities (shared by every game) ──────────────────────

export const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Seedable PRNG (mulberry32) — deterministic across runs for a given seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pointInRect = (
  px: number, py: number,
  rx: number, ry: number, rw: number, rh: number,
) => px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;

export const aabb = (
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

export const dist2 = (ax: number, ay: number, bx: number, by: number) => {
  const dx = ax - bx, dy = ay - by;
  return dx * dx + dy * dy;
};

// ── the mount / loop ───────────────────────────────────────────────────────

export function mountGame(
  canvas: HTMLCanvasElement,
  game: Game,
  options: MountOptions = {},
): GameController {
  const step = options.fixedStep ?? 1 / 60;
  const maxFrame = options.maxFrame ?? 0.25;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const reducedMotion =
    document.documentElement.getAttribute('data-reduced-motion') === 'true';

  const gc: GameContext = {
    ctx,
    canvas,
    width: 0,
    height: 0,
    rng: mulberry32(options.seed ?? (Math.random() * 2 ** 32) >>> 0),
    now: 0,
    reducedMotion,
  };

  // Size the backing store for the device pixel ratio; draw in CSS pixels.
  function applySize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const changed = w !== gc.width || h !== gc.height;
    gc.width = w;
    gc.height = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (changed) game.resize?.(w, h, gc);
  }

  function toLocal(clientX: number, clientY: number) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (gc.width / Math.max(1, r.width)),
      y: (clientY - r.top) * (gc.height / Math.max(1, r.height)),
    };
  }

  // input
  const onPointer = (type: 'down' | 'up' | 'move') => (e: PointerEvent) => {
    const { x, y } = toLocal(e.clientX, e.clientY);
    game.onInput?.({ type, x, y }, gc);
  };
  const onDown = onPointer('down');
  const onUp = onPointer('up');
  const onMove = onPointer('move');
  const onKey = (e: KeyboardEvent) => {
    game.onInput?.({ type: 'key', x: 0, y: 0, key: e.key }, gc);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('keydown', onKey);
  canvas.tabIndex = canvas.tabIndex >= 0 ? canvas.tabIndex : 0;

  // loop
  let raf = 0;
  let acc = 0;
  let last = 0;
  let running = false;
  let started = false;

  function render(alpha: number) {
    if (options.background) {
      ctx.save();
      ctx.fillStyle = options.background;
      ctx.fillRect(0, 0, gc.width, gc.height);
      ctx.restore();
    } else {
      ctx.clearRect(0, 0, gc.width, gc.height);
    }
    game.draw(gc, alpha);
  }

  function frame(t: number) {
    if (!running) return;
    if (!last) last = t;
    const dt = Math.min((t - last) / 1000, maxFrame);
    last = t;
    acc += dt;
    gc.now += dt;
    while (acc >= step) {
      game.update(step, gc);
      acc -= step;
    }
    render(acc / step);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // pause when off-screen or tab hidden — idle games shouldn't burn CPU
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') start();
      else stop();
    },
    { threshold: 0.01 },
  );
  io.observe(canvas);

  const onVisibility = () => {
    if (document.visibilityState === 'hidden') stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(() => applySize());
  ro.observe(canvas);

  // boot
  applySize();
  game.init(gc);
  started = true;
  // Paint one frame synchronously so the canvas is never blank before the first
  // rAF tick (and shows a static frame even where rAF is throttled/paused).
  render(0);
  start();

  return {
    pause: stop,
    resume: start,
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('keydown', onKey);
      if (started) game.destroy?.();
    },
  };
}
