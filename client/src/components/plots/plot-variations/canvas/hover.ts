import { ExtendedRun } from "@/types/data/run";
import { getRunColor } from "@/utils/plots/colors-functions";
import {
  PLOT_CONFIG,
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  DOT_RADIUS,
  DOT_STROKE_WIDTH,
  STONE,
} from "@/lib/config/plots/plots-constants";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";
import { Scales } from "./types";
import { drawLine, setPlotClip } from "./lines";
import { drawAxesAndGrid } from "./axes";
import { MARGIN } from "./constants";

/**
 * Draws dimmed lines + highlighted hovered line + guide + dot.
 * Everything is drawn inside the clip region so nothing bleeds outside the plot area.
 * Returns the closest data point for tooltip content.
 */
export const drawHoverFrame = (
  ctx: CanvasRenderingContext2D,
  runs: ExtendedRun[],
  scales: Scales,
  hoveredRun: ExtendedRun,
  mouseX: number,
  selectedFlags: string[],
  hasSelection: boolean,
  width: number,
  height: number,
): { year: number; value: number } => {
  const { xScale, yScale } = scales;
  const plotH = height - MARGIN.top - MARGIN.bottom;

  // Clear everything and redraw axes
  ctx.clearRect(0, 0, width, height);
  drawAxesAndGrid(ctx, scales, runs, width, height);

  // Clip to plot area — everything below is clipped until ctx.restore()
  setPlotClip(ctx, width, height);

  // Draw all non-hovered lines at reduced opacity in their own color
  for (const run of runs) {
    if (run.runId === hoveredRun.runId) continue;
    const color = getRunColor(run, selectedFlags, hasSelection);
    drawLine(ctx, run, scales, color, PLOT_CONFIG.NORMAL_STROKE_WIDTH, PLOT_CONFIG.DIMMED_OPACITY);
  }

  // Highlight hovered line
  const highlightColor =
    CATEGORY_CONFIG[hoveredRun.flagCategory as keyof typeof CATEGORY_CONFIG]?.color ||
    getRunColor(hoveredRun, selectedFlags, hasSelection);

  ctx.globalAlpha = 1;
  drawLine(
    ctx,
    hoveredRun,
    scales,
    highlightColor,
    PLOT_CONFIG.HOVER_HIGHLIGHT_WIDTH,
    PLOT_CONFIG.FULL_OPACITY,
  );

  // Find closest data point to mouse
  const year = xScale.invert(mouseX);
  let closestPoint = hoveredRun.orderedPoints[0];
  let minDiff = Math.abs(closestPoint.year - year);

  for (let i = 1; i < hoveredRun.orderedPoints.length; i++) {
    const diff = Math.abs(hoveredRun.orderedPoints[i].year - year);
    if (diff < minDiff) {
      minDiff = diff;
      closestPoint = hoveredRun.orderedPoints[i];
    }
  }

  const pointX = xScale(closestPoint.year);
  const pointY = yScale(closestPoint.value);

  // Vertical guide line (inside clip)
  ctx.strokeStyle = STONE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pointX, MARGIN.top);
  ctx.lineTo(pointX, MARGIN.top + plotH);
  ctx.stroke();

  // Outer glow (inside clip)
  ctx.strokeStyle = highlightColor;
  ctx.lineWidth = DOT_HOVER_STROKE;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(pointX, pointY, DOT_HOVER_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Solid center dot (inside clip)
  ctx.globalAlpha = 1;
  ctx.fillStyle = highlightColor;
  ctx.beginPath();
  ctx.arc(pointX, pointY, DOT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = DOT_STROKE_WIDTH;
  ctx.stroke();

  // Release clip — everything above was contained in the plot area
  ctx.restore();

  return closestPoint;
};
