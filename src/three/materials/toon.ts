import * as THREE from "three";

/**
 * Shared toon gradient map (design.md §11.3) — 4 hard steps give
 * flat, illustrative shading. Created once, reused everywhere.
 */
let gradientMap: THREE.DataTexture | null = null;

export function getToonGradient(): THREE.DataTexture {
  if (gradientMap) return gradientMap;
  const steps = new Uint8Array([90, 155, 210, 255]);
  const tex = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  gradientMap = tex;
  return tex;
}

/** Runtime-generated cover art — zero image downloads (design.md §15). */
export function createCoverTexture(): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Yellow ground
  ctx.fillStyle = "#F4D94E";
  ctx.fillRect(0, 0, S, S);

  // Halftone field (top-right)
  ctx.fillStyle = "rgba(20,20,20,0.22)";
  for (let y = 24; y < 210; y += 14) {
    for (let x = 300; x < 496; x += 14) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Wordmark
  ctx.fillStyle = "#141414";
  ctx.font = '900 96px "Arial Black", Impact, sans-serif';
  ctx.textBaseline = "top";
  ctx.fillText("BIZARRE", 36, 56);
  ctx.fillText("LOVE", 36, 156);

  // Red band with subtitle
  ctx.fillStyle = "#EC3C43";
  ctx.fillRect(36, 292, S - 72, 56);
  ctx.fillStyle = "#F7F1DF";
  ctx.font = '700 24px "Arial Narrow", Arial, sans-serif';
  ctx.fillText("OUR BIZARRE ADVENTURE", 52, 308);

  // VOL. 06 badge
  ctx.fillStyle = "#141414";
  ctx.fillRect(36, 380, 176, 72);
  ctx.fillStyle = "#F4D94E";
  ctx.font = '900 44px "Arial Black", Impact, sans-serif';
  ctx.fillText("VOL. 06", 52, 394);

  // Cyan tick
  ctx.fillStyle = "#16B8B1";
  ctx.fillRect(36, 476, S - 72, 14);

  // Ink frame
  ctx.strokeStyle = "#141414";
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, S - 20, S - 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
