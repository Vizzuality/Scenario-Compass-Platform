import { ExtendedRun } from "@/types/data/run";
import { ZoomState, Scales } from "./types";
import { computeScales, Extent } from "./scales";
import { setupCanvas } from "./canvas-utils";
import { buildSpatialIndex, SpatialIndex } from "./hit-detection";
import { drawAxesAndGrid } from "./axes";
import { drawAllLines } from "./lines";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";
import { getRunColor } from "@/utils/plots/colors-functions";

export type ColorFn = (run: ExtendedRun) => string;

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
  selectedRun: ExtendedRun | null,
  getLineColor?: ColorFn,
): RenderResult | null => {
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const ctx = setupCanvas(canvas, rect.width, rect.height);
  if (!ctx) return null;

  const scales = computeScales(extent, rect.width, rect.height, zoom);
  const spatialIndex = buildSpatialIndex(runs, scales);

  ctx.clearRect(0, 0, rect.width, rect.height);
  drawAxesAndGrid(ctx, scales, runs, rect.width, rect.height);
  drawAllLines(
    ctx,
    runs,
    scales,
    selectedFlags,
    hasSelection,
    rect.width,
    rect.height,
    selectedRun,
    getLineColor,
  );

  if (selectedRun) {
    const color = getLineColor
      ? getLineColor(selectedRun)
      : getRunColor(
          selectedRun,
          getCategoryAbbrev(selectedRun.flagCategory)
            ? [getCategoryAbbrev(selectedRun.flagCategory)!]
            : selectedFlags,
          true,
        );

    const path = new Path2D();
    selectedRun.orderedPoints.forEach((point, index) => {
      const x = scales.xScale(point.year);
      const yValue = "median" in point ? (point as any).median : point.value;
      const y = scales.yScale(yValue);

      if (index === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke(path);
    ctx.restore();
  }

  return { scales, spatialIndex };
};
