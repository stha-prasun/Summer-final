const BG_THRESHOLD = 20;

function isBg(r, g, b) {
  return r < BG_THRESHOLD && g < BG_THRESHOLD && b < BG_THRESHOLD;
}

function floodFillToTransparent(imageData) {
  const { data, width, height } = imageData;
  const visited = new Uint8Array(width * height);

  function idx(x, y) {
    return (y * width + x) * 4;
  }

  function isMatch(x, y) {
    const i = idx(x, y);
    return data[i + 3] > 0 && isBg(data[i], data[i + 1], data[i + 2]);
  }

  const stack = [];
  for (let x = 0; x < width; x++) {
    if (isMatch(x, 0)) stack.push(x, 0);
    if (isMatch(x, height - 1)) stack.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    if (isMatch(0, y)) stack.push(0, y);
    if (isMatch(width - 1, y)) stack.push(width - 1, y);
  }

  while (stack.length > 0) {
    const y = stack.pop();
    const x = stack.pop();
    const key = y * width + x;
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (visited[key]) continue;
    if (!isMatch(x, y)) continue;

    visited[key] = 1;
    const i = idx(x, y);
    data[i + 3] = 0;

    stack.push(x + 1, y);
    stack.push(x - 1, y);
    stack.push(x, y + 1);
    stack.push(x, y - 1);
  }
}

function cropToContent(imageData) {
  const { data, width, height } = imageData;
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const cropped = new ImageData(cw, ch);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const si = (y * width + x) * 4;
      const di = ((y - minY) * cw + (x - minX)) * 4;
      cropped.data[di] = data[si];
      cropped.data[di + 1] = data[si + 1];
      cropped.data[di + 2] = data[si + 2];
      cropped.data[di + 3] = data[si + 3];
    }
  }

  return cropped;
}

function rotateImage(source, degrees) {
  const w = source.width;
  const h = source.height;
  const swap = degrees % 180 !== 0;
  const cw = swap ? h : w;
  const ch = swap ? w : h;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(source, -w / 2, -h / 2);

  return canvas;
}

function imageDataToCanvas(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function processImage(source, rotation) {
  const rotated = rotateImage(source, rotation);
  const canvas = document.createElement("canvas");
  canvas.width = rotated.width;
  canvas.height = rotated.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(rotated, 0, 0);
  const imageData = ctx.getImageData(0, 0, rotated.width, rotated.height);

  floodFillToTransparent(imageData);
  const cropped = cropToContent(imageData);

  return imageDataToCanvas(cropped);
}

async function loadAsset(url) {
  try {
    const mod = await import(url);
    return mod.default;
  } catch {
    return null;
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

let spritesPromise = null;

function loadSprites() {
  if (typeof Image === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }
  if (spritesPromise) return spritesPromise;

  spritesPromise = (async () => {
    const [carUrl, policeUrl] = await Promise.all([
      loadAsset("./assets/car.webp"),
      loadAsset("./assets/police.png"),
    ]);
    if (!carUrl || !policeUrl) return null;

    const [carImg, policeImg] = await Promise.all([
      loadImage(carUrl),
      loadImage(policeUrl),
    ]);
    if (!carImg || !policeImg) return null;

    try {
      return {
        player: processImage(carImg, 180),
        traffic: processImage(policeImg, 90),
      };
    } catch {
      return null;
    }
  })();

  return spritesPromise;
}

let _sprites = null;

export function getSprites() {
  return _sprites;
}

export function initSprites() {
  return loadSprites().then((sprites) => {
    _sprites = sprites;
    return sprites;
  });
}