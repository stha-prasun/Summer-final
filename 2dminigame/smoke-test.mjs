import { createGameEngine } from "/Users/lunatra/Desktop/Summer_classes/fullstack/2dminigame/src/components/RetroRacer/gameEngine.js";

const store = {};
globalThis.window = {
  localStorage: {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
  },
};

let rafCb = null;
globalThis.requestAnimationFrame = (cb) => { rafCb = cb; return 1; };
globalThis.cancelAnimationFrame = () => { rafCb = null; };

const calls = { draw: 0 };
const ctx = {
  imageSmoothingEnabled: false,
  fillStyle: "",
  fillRect: (...a) => { calls.draw += 1; void a; },
};
const canvas = { getContext: () => ctx };

let scoreTicks = 0;
let gameOverScore = null;
let newBest = null;
const engine = createGameEngine(canvas, {
  onScoreChange: () => { scoreTicks += 1; },
  onGameOver: (s, b, record) => { gameOverScore = s; newBest = b; },
});

engine.start();
engine.startLoop();
let frames = 0;
const t0 = performance.now();
while (rafCb && frames < 3000) {
  rafCb(t0 + frames * 16.7);
  frames += 1;
  if (frames % 60 === 0) engine.move(frames % 2 === 0 ? 1 : -1);
  if (frames === 200) engine.togglePause();
  if (frames === 260) engine.togglePause();
}
engine.destroy();

const ok = (name, cond) => console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);

ok("ran 3000 frames without throwing", frames === 3000);
ok("drew something every frame", calls.draw > 1000);
ok("score callback fired", scoreTicks > 10);
ok("game over triggered eventually", gameOverScore !== null && gameOverScore > 0);
ok("best score persisted", Number(store["retro-racer-best"]) === gameOverScore);
ok("game over score reported with new best", newBest === gameOverScore);

const PLAYER_H = 40;
const PLAYER_Y = 462;

let totalSurvival = 0;
for (let run = 0; run < 5; run += 1) {
  let over = false;
  let finalScore = 0;
  const e2 = createGameEngine(canvas, {
    onScoreChange: () => {},
    onGameOver: (s) => { over = true; finalScore = s; },
  });
  e2.start();
  e2.startLoop();
  const st = performance.now();
  let f = 0;
  while (!over && f < 20000) {
    const state = e2.getState();
    const playerBottom = PLAYER_Y + PLAYER_H;
    const threat = state.obstacles.some(
      (o) =>
        o.lane === state.player.lane &&
        o.y > playerBottom - 340 &&
        o.y < playerBottom
    );
    if (threat && state.mode === "playing") {
      const safe = [0, 1, 2].filter(
        (l) => !state.obstacles.some((o) => o.lane === l && o.y > playerBottom - 320 && o.y < playerBottom)
      );
      const target = safe.length > 0 ? safe[0] : (state.player.lane + 1) % 3;
      const dir = target - state.player.lane;
      if (dir !== 0) e2.move(Math.sign(dir));
    }
    f += 1;
    rafCb(st + f * 16.7);
  }
  e2.destroy();
  totalSurvival += finalScore;
}

const avgSurvival = totalSurvival / 5;
ok(`dodger bot average survival >= 15s (got ${avgSurvival.toFixed(1)}s)`, avgSurvival >= 15);
console.log(`bot survival per run: ${(totalSurvival / 5).toFixed(1)}s avg over 5 runs`);

console.log(`frames=${frames} draws=${calls.draw} scoreTicks=${scoreTicks} gameOver=${gameOverScore?.toFixed(2)}s`);
