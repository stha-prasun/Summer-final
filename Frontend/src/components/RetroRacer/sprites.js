import { COLORS } from "./constants.js";
import { drawRect } from "./helpers.js";
import { getSprites } from "./carSprite.js";

function drawSpriteCar(ctx, x, y, w, h, sprite) {
  const spriteAspect = sprite.width / sprite.height;
  const targetAspect = w / h;

  let dw, dh;
  if (spriteAspect > targetAspect) {
    dw = w;
    dh = Math.round(w / spriteAspect);
  } else {
    dh = h;
    dw = Math.round(h * spriteAspect);
  }

  const dx = x + Math.round((w - dw) / 2);
  const dy = y + Math.round((h - dh) / 2);

  ctx.drawImage(sprite, dx, dy, dw, dh);
}

function rectFallbackPlayer(ctx, x, y, w, h) {
  drawRect(ctx, x - 3, y + 6, 6, 10, "#141414");
  drawRect(ctx, x + w - 3, y + 6, 6, 10, "#141414");
  drawRect(ctx, x - 3, y + h - 16, 6, 10, "#141414");
  drawRect(ctx, x + w - 3, y + h - 16, 6, 10, "#141414");

  drawRect(ctx, x + 2, y + 3, w + 4, 4, COLORS.shadow);
  drawRect(ctx, x, y, w, h, COLORS.player);
  drawRect(ctx, x, y, w, 4, COLORS.playerDark);
  drawRect(ctx, x + w - 4, y, 4, 20, COLORS.playerDark);
  drawRect(ctx, x + 2, y + 2, w - 4, 5, "#f2f0e6");

  drawRect(ctx, x + 6, y + 16, w - 12, 18, COLORS.window);
  drawRect(ctx, x + 8, y + 18, w - 16, 11, "#4a5260");

  drawRect(ctx, x, y + h - 5, w, 5, COLORS.playerDark);
}

function rectFallbackTraffic(ctx, x, y, w, h) {
  drawRect(ctx, x - 3, y + 6, 6, 9, "#10141c");
  drawRect(ctx, x + w - 3, y + 6, 6, 9, "#10141c");
  drawRect(ctx, x - 3, y + h - 14, 6, 9, "#10141c");
  drawRect(ctx, x + w - 3, y + h - 14, 6, 9, "#10141c");

  drawRect(ctx, x + 2, y + 3, w + 4, 4, COLORS.shadow);
  drawRect(ctx, x, y, w, h, COLORS.traffic);
  drawRect(ctx, x, y, w, 4, COLORS.trafficDark);
  drawRect(ctx, x + 4, y + 10, w - 8, 20, COLORS.window);
  drawRect(ctx, x + 6, y + 12, w - 12, 12, "#5a7bb8");
  drawRect(ctx, x + 2, y + h - 7, w - 4, 3, "#e8e6d8");
  drawRect(ctx, x, y + h - 2, w, 2, COLORS.trafficDark);
}

export function drawPlayerCar(ctx, x, y, w, h) {
  const sprites = getSprites();
  if (sprites && typeof ctx.drawImage === "function") {
    drawSpriteCar(ctx, x, y, w, h, sprites.player);
  } else {
    rectFallbackPlayer(ctx, x, y, w, h);
  }
}

export function drawTrafficCar(ctx, x, y, w, h) {
  const sprites = getSprites();
  if (sprites && typeof ctx.drawImage === "function") {
    drawSpriteCar(ctx, x, y, w, h, sprites.traffic);
  } else {
    rectFallbackTraffic(ctx, x, y, w, h);
  }
}

export function drawCone(ctx, x, y, w, h) {
  drawRect(ctx, x + 1, y + 2, w, h, COLORS.shadow);
  drawRect(ctx, x, y + 13, w, h - 13, COLORS.coneDark);
  drawRect(ctx, x, y + 9, w, 4, COLORS.cone);
  drawRect(ctx, x + 2, y + 5, w - 4, 4, COLORS.cone);
  drawRect(ctx, x + 4, y + 2, w - 8, 3, COLORS.cone);
  drawRect(ctx, x + 2, y + 9, w - 4, 2, "#f2f0e6");
}

export function drawBarrier(ctx, x, y, w, h) {
  drawRect(ctx, x + 2, y + 3, w, h - 3, COLORS.shadow);
  drawRect(ctx, x, y + 9, w, h - 9, COLORS.barrierRed);

  let sx = x;
  let white = true;
  while (sx < x + w) {
    drawRect(ctx, sx, y, Math.min(10, x + w - sx), 9, white ? COLORS.barrierWhite : COLORS.barrierRed);
    sx += 10;
    white = !white;
  }
}
