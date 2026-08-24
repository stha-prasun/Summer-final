export const CANVAS_W = 360;
export const CANVAS_H = 560;

export const ROAD_X = 60;
export const ROAD_W = 240;
export const LANE_COUNT = 3;
export const LANE_W = ROAD_W / LANE_COUNT;

export const laneCenterX = (lane) => ROAD_X + LANE_W * lane + LANE_W / 2;

export const ROAD_SPEED_BASE = 140;
export const ROAD_SPEED_MAX = 320;
export const SPEED_RAMP_PER_SEC = 3;

export const SPAWN_BASE_INTERVAL = 1.05;
export const SPAWN_MIN_INTERVAL = 0.45;
export const SPAWN_RAMP_PER_SEC = 0.011;

export const PLAYER = { w: 44, h: 50, y: 462 };
export const PLAYER_MOVE_SPEED = 900;

export const CONE = { w: 20, h: 20 };
export const TRAFFIC = { w: 44, h: 50 };
export const BARRIER = { w: 68, h: 16 };

export const TRAFFIC_SPEED_FACTOR = 0.72;

export const MIN_SAME_LANE_GAP = 170;
export const WALL_BAND = 210;
export const SPAWN_OVERLAP_MARGIN = 12;

export const BEST_KEY = "retro-racer-best";

export const COLORS = {
  bg: "#1a1a24",
  road: "#33333f",
  roadDark: "#2b2b35",
  edge: "#e8e6d8",
  dash: "#f2c230",
  player: "#e03030",
  playerDark: "#a01f1f",
  window: "#20242c",
  traffic: "#2f6fd0",
  trafficDark: "#1d4a94",
  cone: "#ff7a1a",
  coneDark: "#b34a00",
  barrierRed: "#e03030",
  barrierWhite: "#f2f0e6",
  shadow: "rgba(0, 0, 0, 0.35)",
};
