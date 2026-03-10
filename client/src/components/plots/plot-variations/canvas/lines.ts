import { ExtendedRun } from "@/types/data/run";
import { getRunColor } from "@/utils/plots/colors-functions";
import { PLOT_CONFIG } from "@/lib/config/plots/plots-constants";
import { Scales } from "./types";
import { MARGIN } from "./scales";

/**
 * Sets a clip region to the plot area so lines don't bleed over axes.
 * Always pair with ctx.restore() after drawing.
 */
export const setPlotClip = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  ctx.save();
  ctx.beginPath();
  ctx.rect(MARGIN.left, MARGIN.top, plotW, plotH);
  ctx.clip();
};

/** Draws a single run's line on the canvas. */
export const drawLine = (
  ctx: CanvasRenderingContext2D,
  run: ExtendedRun,
  scales: Scales,
  color: string,
  lineWidth: number,
  alpha: number,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  run.orderedPoints.forEach((point, i) => {
    const x = scales.xScale(point.year);
    const y = scales.yScale(point.value);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
};

/** Draws all runs inside a clipped plot area at normal opacity. */
export const drawAllLines = (
  ctx: CanvasRenderingContext2D,
  runs: ExtendedRun[],
  scales: Scales,
  selectedFlags: string[],
  hasSelection: boolean,
  width: number,
  height: number,
) => {
  setPlotClip(ctx, width, height);

  runs.forEach((run) => {
    const color = getRunColor(run, selectedFlags, hasSelection);
    drawLine(ctx, run, scales, color, PLOT_CONFIG.NORMAL_STROKE_WIDTH, PLOT_CONFIG.NORMAL_OPACITY);
  });
  ctx.globalAlpha = 1;

  ctx.restore();
};
