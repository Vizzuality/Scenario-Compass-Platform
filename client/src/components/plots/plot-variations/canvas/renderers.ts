import { ExtendedRun } from "@/types/data/run";
import { Scales, ZoomState } from "./types";
import { computeScales, setupCanvas, Extent } from "./scales";
import { buildSpatialIndex, SpatialIndex } from "./hit-detection";
import { drawAxesAndGrid } from "@/components/plots/plot-variations/canvas/axes";
import { drawAllLines } from "@/components/plots/plot-variations/canvas/lines";

interface RendererDeps {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  runs: ExtendedRun[];
  extent: Extent;
  selectedFlags: string[];
  hasSelection: boolean;
  /** Read current zoom from mutable ref — avoids stale closures. */
  getZoom: () => ZoomState;
  /** Read current scales from mutable ref — for repaintBase. */
  getScales: () => Scales | null;
  /** Write back computed scales + spatial index to mutable ref. */
  setComputed: (scales: Scales, spatialIndex: SpatialIndex) => void;
}

/**
 * Creates the two render functions used throughout the chart lifecycle.
 *
 * renderFull:  Full pipeline — resize canvas, recompute scales + quadtree, draw everything.
 *              Called on: mount, resize, zoom/pan changes, data changes.
 *
 * repaintBase: Lightweight — clears canvas and redraws axes only using cached scales.
 *              Called on: every mousemove frame before drawing the hover overlay.
 *              Skips canvas resize and quadtree rebuild for speed.
 */
export const createRenderers = (deps: RendererDeps) => {
  const { canvas, container, runs, extent, selectedFlags, hasSelection } = deps;

  const renderFull = () => {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const ctx = setupCanvas(canvas, rect.width, rect.height);
    if (!ctx) return;

    const scales = computeScales(extent, rect.width, rect.height, deps.getZoom());
    const spatialIndex = buildSpatialIndex(runs, scales);
    deps.setComputed(scales, spatialIndex);

    ctx.clearRect(0, 0, rect.width, rect.height);
    drawAxesAndGrid(ctx, scales, runs, rect.width, rect.height);
    drawAllLines(ctx, runs, scales, selectedFlags, hasSelection, rect.width, rect.height);
  };

  const repaintBase = () => {
    const ctx = canvas.getContext("2d");
    const scales = deps.getScales();
    if (!ctx || !scales) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawAxesAndGrid(ctx, scales, runs, rect.width, rect.height);
  };

  return { renderFull, repaintBase };
};
