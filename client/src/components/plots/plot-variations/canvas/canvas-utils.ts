/**
 * Configures a canvas for crisp rendering on high-DPI displays.
 * Sets internal pixel buffer to (width × DPR) × (height × DPR),
 * CSS-scales it back down so all drawing uses CSS-pixel coordinates.
 */
export const setupCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;

  const w = Math.round(width);
  const h = Math.round(height);

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return ctx;
};
