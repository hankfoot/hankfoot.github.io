// Shared, game-agnostic visual effects for the Canvas2D minigames.
//
// createConfetti() returns a tiny particle system a game can `burst()` on a win
// (or any celebratory beat), then `update(dt)` and `draw(g)` from its loop. It
// holds no DOM/engine references, so any game on the shell can reuse it.

export interface Confetti {
  /** Spray `count` pieces from (cx, cy). `power` scales speed/size to the canvas. */
  burst(cx: number, cy: number, count?: number, power?: number): void;
  update(dt: number): void;
  draw(g: CanvasRenderingContext2D): void;
  readonly active: boolean;
}

interface Piece {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; vr: number;
  size: number; color: string;
  life: number; ttl: number;
  round: boolean;
}

// Festive but on-brand: the hand yellows, the fantasy violets, a few brights.
const PALETTE = [
  '#ffd140', '#e8ad3c', '#9a6cf0', '#7cc0f2',
  '#f06ca0', '#6cd0a0', '#ff8f5a', '#c8b6ff',
];

export function createConfetti(rng: () => number = Math.random): Confetti {
  const pieces: Piece[] = [];
  let grav = 1400; // px/s², set from `power` on each burst

  return {
    get active() { return pieces.length > 0; },

    burst(cx, cy, count = 90, power = 700) {
      grav = power * 1.9;
      for (let i = 0; i < count; i++) {
        const a = rng() * Math.PI * 2;
        const sp = power * (0.25 + rng() * 0.75);
        pieces.push({
          x: cx, y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - power * (0.45 + rng() * 0.5), // biased upward
          rot: rng() * Math.PI * 2,
          vr: (rng() * 2 - 1) * 8,
          size: power * 0.009 * (0.7 + rng() * 0.7),
          color: PALETTE[(rng() * PALETTE.length) | 0],
          life: 0,
          ttl: 1.5 + rng() * 1.3,
          round: rng() < 0.35,
        });
      }
    },

    update(dt) {
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.life += dt;
        p.vy += grav * dt;
        p.vx *= 1 - Math.min(1, 0.9 * dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.life >= p.ttl) pieces.splice(i, 1);
      }
    },

    draw(g) {
      for (const p of pieces) {
        const fade = Math.min(1, (p.ttl - p.life) / 0.5);
        if (fade <= 0) continue;
        g.save();
        g.globalAlpha = fade;
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.fillStyle = p.color;
        if (p.round) {
          g.beginPath();
          g.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          g.fill();
        } else {
          g.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        }
        g.restore();
      }
    },
  };
}
