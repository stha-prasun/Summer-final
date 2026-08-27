import {
  CANVAS_W,
  CANVAS_H,
  ROAD_X,
  ROAD_W,
  LANE_COUNT,
  LANE_W,
  laneCenterX,
  ROAD_SPEED_BASE,
  ROAD_SPEED_MAX,
  SPEED_RAMP_PER_SEC,
  SPAWN_BASE_INTERVAL,
  SPAWN_MIN_INTERVAL,
  SPAWN_RAMP_PER_SEC,
  PLAYER,
  PLAYER_MOVE_SPEED,
  CONE,
  TRAFFIC,
  BARRIER,
  TRAFFIC_SPEED_FACTOR,
  MIN_SAME_LANE_GAP,
  WALL_BAND,
  SPAWN_OVERLAP_MARGIN,
  COLORS,
} from "./constants.js";
import { loadBest, saveBest } from "./best.js";
import { rand, randInt, clamp, rectsOverlap, drawRect } from "./helpers.js";
import { drawPlayerCar, drawTrafficCar, drawCone, drawBarrier } from "./sprites.js";

function obstacleSize(type) {
  if (type === "cone") return CONE;
  if (type === "traffic") return TRAFFIC;
  return BARRIER;
}

const DASH_PERIOD = 60;
const DASH_H = 22;
const DASH_W = 6;
const ROAD_BAND = 64;

export function createGameEngine(canvas, callbacks) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const engine = {
    mode: "start",
    elapsed: 0,
    best: loadBest(),
    roadOffset: 0,
    obstacles: [],
    player: { lane: 1, x: laneCenterX(1), y: PLAYER.y },
    spawnTimer: 0.9,
    rafId: null,
    lastTime: 0,
    lastScoreTick: -1,
  };

  const currentSpeed = () =>
    Math.min(ROAD_SPEED_MAX, ROAD_SPEED_BASE + engine.elapsed * SPEED_RAMP_PER_SEC);

  const currentSpawnInterval = () =>
    Math.max(SPAWN_MIN_INTERVAL, SPAWN_BASE_INTERVAL - engine.elapsed * SPAWN_RAMP_PER_SEC);

  function reset() {
    engine.mode = "playing";
    engine.elapsed = 0;
    engine.roadOffset = 0;
    engine.obstacles = [];
    engine.player = { lane: 1, x: laneCenterX(1), y: PLAYER.y };
    engine.spawnTimer = 0.9;
    engine.lastScoreTick = -1;
    engine.lastTime = performance.now();
  }

  function start() {
    reset();
    callbacks.onScoreChange("0.0");
  }

  function togglePause() {
    if (engine.mode === "playing") engine.mode = "paused";
    else if (engine.mode === "paused") engine.mode = "playing";
    engine.lastTime = performance.now();
  }

  function move(direction) {
    if (engine.mode !== "playing") return;
    const nextLane = clamp(engine.player.lane + direction, 0, LANE_COUNT - 1);
    engine.player.lane = nextLane;
  }

  function gameOver() {
    engine.mode = "gameover";
    const isNewBest = engine.elapsed > engine.best && engine.elapsed > 0;
    if (isNewBest) {
      engine.best = engine.elapsed;
      saveBest(engine.best);
    }
    callbacks.onGameOver(engine.elapsed, engine.best, isNewBest);
  }

  function makeObstacle(type, lane) {
    return {
      type,
      lane,
      x: laneCenterX(lane),
      y: -60 - rand(0, 60),
      w: obstacleSize(type).w,
      h: obstacleSize(type).h,
      speedFactor: type === "traffic" ? TRAFFIC_SPEED_FACTOR : 1,
    };
  }

  function isFairSpawn(lane, obstacle) {
    const topY = obstacle.y + obstacle.h;

    for (const other of engine.obstacles) {
      if (other.lane === lane && other.y < MIN_SAME_LANE_GAP) return false;

      const overlapRect = {
        x: obstacle.x - obstacle.w / 2 - SPAWN_OVERLAP_MARGIN,
        y: topY - obstacle.h - SPAWN_OVERLAP_MARGIN,
        w: obstacle.w + SPAWN_OVERLAP_MARGIN * 2,
        h: obstacle.h + SPAWN_OVERLAP_MARGIN * 2,
      };
      const otherRect = {
        x: other.x - other.w / 2,
        y: other.y,
        w: other.w,
        h: other.h,
      };
      if (rectsOverlap(overlapRect, otherRect)) return false;
    }

    const blockedLanes = new Set();
    for (const other of engine.obstacles) {
      if (other.lane !== lane && other.y < WALL_BAND) blockedLanes.add(other.lane);
    }
    const openLanes = LANE_COUNT - blockedLanes.size - 1;
    if (openLanes <= 0) return false;

    return true;
  }

  function attemptSpawn() {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const lane = randInt(0, LANE_COUNT - 1);
      const roll = Math.random();
      const type = roll < 0.45 ? "cone" : roll < 0.8 ? "traffic" : "barrier";
      const obstacle = makeObstacle(type, lane);
      if (isFairSpawn(lane, obstacle)) {
        engine.obstacles.push(obstacle);
        return;
      }
    }
  }

  function update(dt) {
    engine.elapsed += dt;
    const speed = currentSpeed();

    engine.roadOffset += speed * dt;

    const targetX = laneCenterX(engine.player.lane);
    const dx = targetX - engine.player.x;
    const step = PLAYER_MOVE_SPEED * dt;
    engine.player.x += Math.abs(dx) <= step ? dx : Math.sign(dx) * step;

    engine.spawnTimer -= dt;
    if (engine.spawnTimer <= 0) {
      attemptSpawn();
      engine.spawnTimer = currentSpawnInterval();
    }

    for (const obstacle of engine.obstacles) {
      obstacle.y += speed * obstacle.speedFactor * dt;
    }
    engine.obstacles = engine.obstacles.filter((o) => o.y < CANVAS_H + 40);

    const pRect = {
      x: engine.player.x - PLAYER.w / 2 + 4,
      y: engine.player.y + 3,
      w: PLAYER.w - 8,
      h: PLAYER.h - 7,
    };
    for (const obstacle of engine.obstacles) {
      const size = obstacleSize(obstacle.type);
      const shrink = obstacle.type === "traffic" ? 6 : obstacle.type === "cone" ? 3 : 0;
      const oRect = {
        x: obstacle.x - size.w / 2 + shrink,
        y: obstacle.y + shrink,
        w: size.w - shrink * 2,
        h: size.h - shrink * 2,
      };
      if (rectsOverlap(pRect, oRect)) {
        gameOver();
        break;
      }
    }

    const tick = Math.floor(engine.elapsed * 10);
    if (tick !== engine.lastScoreTick) {
      engine.lastScoreTick = tick;
      callbacks.onScoreChange(engine.elapsed.toFixed(1));
    }
  }

  function render() {
    const bandOffset = engine.roadOffset % ROAD_BAND;
    const dashOffset = engine.roadOffset % DASH_PERIOD;

    drawRect(ctx, 0, 0, CANVAS_W, CANVAS_H, COLORS.bg);

    const bandStart = bandOffset - ROAD_BAND;
    for (let y = bandStart; y < CANVAS_H; y += ROAD_BAND) {
      drawRect(ctx, ROAD_X, y, ROAD_W, 8, COLORS.roadDark);
    }
    drawRect(ctx, ROAD_X, 0, ROAD_W, CANVAS_H, COLORS.road);

    drawRect(ctx, ROAD_X, 0, 4, CANVAS_H, COLORS.edge);
    drawRect(ctx, ROAD_X + ROAD_W - 4, 0, 4, CANVAS_H, COLORS.edge);

    for (let boundary = 1; boundary < LANE_COUNT; boundary += 1) {
      const dashX = ROAD_X + boundary * LANE_W - DASH_W / 2;
      for (let k = -1; k <= CANVAS_H / DASH_PERIOD; k += 1) {
        const dashY = (k * DASH_PERIOD + dashOffset) % (CANVAS_H + DASH_PERIOD) - DASH_PERIOD;
        drawRect(ctx, dashX, dashY, DASH_W, DASH_H, COLORS.dash);
      }
    }

    for (const obstacle of engine.obstacles) {
      if (obstacle.type === "cone") drawCone(ctx, obstacle.x - obstacle.w / 2, obstacle.y, obstacle.w, obstacle.h);
      else if (obstacle.type === "traffic") drawTrafficCar(ctx, obstacle.x - obstacle.w / 2, obstacle.y, obstacle.w, obstacle.h);
      else drawBarrier(ctx, obstacle.x - obstacle.w / 2, obstacle.y, obstacle.w, obstacle.h);
    }

    const p = engine.player;
    drawPlayerCar(ctx, Math.round(p.x - PLAYER.w / 2), p.y, PLAYER.w, PLAYER.h);
  }

  function loop(time) {
    const dt = clamp((time - engine.lastTime) / 1000, 0, 0.05);
    engine.lastTime = time;

    if (engine.mode === "playing") update(dt);
    render();

    engine.rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (engine.rafId === null) {
      engine.lastTime = performance.now();
      engine.rafId = requestAnimationFrame(loop);
    }
  }

  function destroy() {
    if (engine.rafId !== null) {
      cancelAnimationFrame(engine.rafId);
      engine.rafId = null;
    }
  }

  return {
    start,
    togglePause,
    move,
    destroy,
    startLoop,
    getState: () => ({
      mode: engine.mode,
      elapsed: engine.elapsed,
      best: engine.best,
      player: { ...engine.player },
      obstacles: engine.obstacles.map((o) => ({ ...o })),
    }),
  };
}