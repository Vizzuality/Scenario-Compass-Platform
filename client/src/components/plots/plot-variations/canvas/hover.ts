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
import { MARGIN } from "./scales";
import { drawLine, setPlotClip } from "@/components/plots/plot-variations/canvas/lines";

/**
 * Draws dimmed lines (all except hovered) + highlighted hovered line + guide + dot.
 * All line drawing is clipped to the plot area.
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

  // Clip all line drawing to plot area
  setPlotClip(ctx, width, height);

  // Draw all non-hovered lines dimmed
  runs.forEach((run) => {
    if (run.runId === hoveredRun.runId) return;
    const color = getRunColor(run, selectedFlags, hasSelection);
    drawLine(ctx, run, scales, color, PLOT_CONFIG.NORMAL_STROKE_WIDTH, PLOT_CONFIG.DIMMED_OPACITY);
  });

  // Highlighted line
  const highlightColor =
    CATEGORY_CONFIG[hoveredRun.flagCategory as keyof typeof CATEGORY_CONFIG]?.color ||
    getRunColor(hoveredRun, selectedFlags, hasSelection);

  drawLine(
    ctx,
    hoveredRun,
    scales,
    highlightColor,
    PLOT_CONFIG.HOVER_HIGHLIGHT_WIDTH,
    PLOT_CONFIG.FULL_OPACITY,
  );

  // Release clip for overlay elements (guide line, dot)
  ctx.restore();

  // Closest data point to mouse X
  const year = xScale.invert(mouseX);
  const closestPoint = hoveredRun.orderedPoints.reduce((prev, curr) =>
    Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev,
  );

  const pointX = xScale(closestPoint.year);
  const pointY = yScale(closestPoint.value);

  // 1. Vertical guide line (Matches `verticalHoverLine`)
  ctx.strokeStyle = STONE;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(pointX, MARGIN.top);
  ctx.lineTo(pointX, MARGIN.top + plotH);
  ctx.stroke();

  // 2. Outer ring (Matches `pointWrappingCircle`)
  ctx.strokeStyle = highlightColor;
  ctx.lineWidth = DOT_HOVER_STROKE;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(pointX, pointY, DOT_HOVER_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();

  // 3. Inner dot (Matches `intersectionPoint`)
  ctx.globalAlpha = 1; // Reset alpha for the solid dot

  // Fill the inner dot
  ctx.fillStyle = highlightColor;
  ctx.beginPath();
  ctx.arc(pointX, pointY, DOT_RADIUS, 0, 2 * Math.PI);
  ctx.fill();

  // Draw the white stroke around the inner dot
  ctx.strokeStyle = "white";
  ctx.lineWidth = DOT_STROKE_WIDTH;
  ctx.stroke();

  // Reset global alpha for the next render frame
  ctx.globalAlpha = 1;

  return closestPoint;
};
