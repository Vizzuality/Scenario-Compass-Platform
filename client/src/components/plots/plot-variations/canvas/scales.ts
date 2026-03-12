import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { Scales, ZoomState } from "./types";

/**
 * Chart margins in CSS pixels.
 * Left is larger to accommodate y-axis tick labels; bottom for x-axis labels.
 */
export const MARGIN = { top: 20, right: 15, bottom: 40, left: 50 };

/**
 * Computes the bounding box of all data points across all runs.
 *
 * Returns the min/max year (x) and min/max value (y) — this is the "full view"
 * that the chart shows at zoom level k=1.
 *
 * Called once when data changes and cached by the component. Everything else
 * (scales, quadtree, clamp bounds) derives from this extent.
 */
export const computeExtent = (runs: ExtendedRun[]) => {
  const allPoints = runs.flatMap((r) => r.orderedPoints);
  const [xMin, xMax] = d3.extent(allPoints, (d) => d.year) as [number, number];
  const [yMin, yMax] = d3.extent(allPoints, (d) => d.value) as [number, number];
  return { xMin, xMax, yMin, yMax };
};

export type Extent = ReturnType<typeof computeExtent>;

/**
 * Clamps zoom pan offsets so the viewport never moves beyond the data extent.
 *
 * At zoom level k, the visible window covers (1/k) of the full data range.
 * The pan offset (x, y) shifts the viewport center in data space.
 *
 * The math:
 *   - visibleHalf = fullRange / (2 * k)
 *   - The viewport spans [center + pan - visibleHalf, center + pan + visibleHalf]
 *   - We need: center + pan - visibleHalf >= dataMin
 *              center + pan + visibleHalf <= dataMax
 *   - Since center = (dataMin + dataMax) / 2, this simplifies to:
 *              |pan| <= fullRange/2 - visibleHalf
 *
 * At k=1, visibleHalf = fullRange/2, so maxPan = 0 — no panning allowed.
 * At k=2, visibleHalf = fullRange/4, so maxPan = fullRange/4 — can pan 25% each way.
 */
export const clampZoom = (zoom: ZoomState, extent: Extent): ZoomState => {
  const { xMin, xMax, yMin, yMax } = extent;

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  const xHalf = xRange / (2 * zoom.k);
  const yHalf = yRange / (2 * zoom.k);

  const maxPanX = Math.max(0, xRange / 2 - xHalf);
  const maxPanY = Math.max(0, yRange / 2 - yHalf);

  return {
    k: zoom.k,
    x: Math.max(-maxPanX, Math.min(maxPanX, zoom.x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, zoom.y)),
  };
};

/**
 * Computes D3 linear scales that map data values → pixel positions,
 * incorporating the current zoom and pan state.
 *
 * How zoom works:
 *   1. Start with the full data extent [xMin, xMax]
 *   2. At zoom k, narrow the visible domain to (1/k) of the full range
 *   3. Center the narrowed domain at the data midpoint + clamped pan offset
 *   4. Map this narrowed domain to the pixel range [MARGIN.left, MARGIN.left + plotWidth]
 *
 * The y-axis range is inverted ([bottom, top]) because canvas y increases downward
 * but data values increase upward.
 *
 * @param extent  - Pre-computed data bounding box (from computeExtent)
 * @param width   - Container width in CSS pixels
 * @param height  - Container height in CSS pixels
 * @param zoom    - Current zoom/pan state
 */
export const computeScales = (
  extent: Extent,
  width: number,
  height: number,
  zoom: ZoomState,
): Scales => {
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  const { xMin, xMax, yMin, yMax } = extent;

  // Clamp pan so viewport stays within data bounds
  const clamped = clampZoom(zoom, extent);

  // Full data range on each axis
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  // Viewport center = data midpoint + clamped pan offset
  const xCenter = (xMin + xMax) / 2 + clamped.x;
  const yCenter = (yMin + yMax) / 2 + clamped.y;

  // At zoom k, show (1/k) of the full range — half on each side of center
  const xHalf = xRange / (2 * zoom.k);
  const yHalf = yRange / (2 * zoom.k);

  return {
    xScale: d3
      .scaleLinear()
      .domain([xCenter - xHalf, xCenter + xHalf])
      .range([MARGIN.left, MARGIN.left + plotW]),
    yScale: d3
      .scaleLinear()
      .domain([yCenter - yHalf, yCenter + yHalf])
      .range([MARGIN.top + plotH, MARGIN.top]),
  };
};

/**
 * Configures a canvas element for crisp rendering on high-DPI (Retina) displays.
 *
 * The trick: set the canvas's internal pixel buffer to (width × DPR) × (height × DPR),
 * then CSS-scale it back down to width × height. This gives us 2x (or 3x) the pixel
 * density, making lines and text look sharp.
 *
 * After calling this, all drawing commands use CSS-pixel coordinates — the DPR
 * scaling is handled by ctx.scale() so callers don't need to think about it.
 *
 * ⚠️ Setting canvas.width clears all canvas content and resets the transform.
 *    Only call this when dimensions actually change (resize, initial render).
 *    For repaint-only frames, use repaintBase() which preserves dimensions.
 *
 * @returns The 2D context, or null if the canvas can't provide one
 */
export const setupCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  return ctx;
};
