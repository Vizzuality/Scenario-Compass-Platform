import { ExtendedRun } from "@/types/data/run";
import { ZoomState, Scales } from "./types";
import { computeScales, Extent } from "./scales";
import { setupCanvas } from "./canvas-utils";
import { buildSpatialIndex, SpatialIndex } from "./hit-detection";
import { drawAxesAndGrid } from "./axes";
import { drawAllLines } from "./lines";

export interface RenderResult {
  scales: Scales;
  spatialIndex: SpatialIndex;
}

export const renderChart = (
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  runs: ExtendedRun[],
  extent: Extent,
  selectedFlags: string[],
  hasSelection: boolean,
  zoom: ZoomState,
): RenderResult | null => {
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const ctx = setupCanvas(canvas, rect.width, rect.height);
  if (!ctx) return null;

  const scales = computeScales(extent, rect.width, rect.height, zoom);
  const spatialIndex = buildSpatialIndex(runs, scales);

  ctx.clearRect(0, 0, rect.width, rect.height);
  drawAxesAndGrid(ctx, scales, runs, rect.width, rect.height);
  drawAllLines(ctx, runs, scales, selectedFlags, hasSelection, rect.width, rect.height);

  return { scales, spatialIndex };
};
