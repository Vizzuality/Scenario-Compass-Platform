import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { formatShortenedNumber } from "@/utils/plots/format-functions";
import { Scales } from "./types";
import { MARGIN } from "./scales";
import { calculateOptimalTicksWithNiceYears } from "@/utils/plots/ticks-computation";
import { GRID_STROKE_COLOR, GRID_TEXT_COLOR } from "@/lib/config/plots/plots-constants";

const AXIS_FONT = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/** Draws horizontal grid lines across the plot area at each y-axis tick. */
const drawGrid = (
  ctx: CanvasRenderingContext2D,
  yScale: d3.ScaleLinear<number, number>,
  plotW: number,
  domainYMin: number,
  domainYMax: number,
) => {
  yScale.ticks(5).forEach((tick) => {
    if (tick < domainYMin || tick > domainYMax) return;
    const y = yScale(tick);
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, y);
    ctx.lineTo(MARGIN.left + plotW, y);
    ctx.stroke();
  });
};

/** Draws the y-axis line, tick marks, tick labels, and rotated unit label. */
const drawYAxis = (
  ctx: CanvasRenderingContext2D,
  yScale: d3.ScaleLinear<number, number>,
  plotH: number,
  domainYMin: number,
  domainYMax: number,
  unit: string,
) => {
  ctx.beginPath();
  ctx.moveTo(MARGIN.left, MARGIN.top);
  ctx.lineTo(MARGIN.left, MARGIN.top + plotH);
  ctx.stroke();

  yScale.ticks(5).forEach((tick) => {
    if (tick < domainYMin || tick > domainYMax) return;
    const y = yScale(tick);
    ctx.beginPath();
    ctx.moveTo(MARGIN.left - 1, y);
    ctx.lineTo(MARGIN.left, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillStyle = GRID_TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.fillText(formatShortenedNumber(tick), MARGIN.left - 5, y);
  });

  ctx.save();
  ctx.translate(10, MARGIN.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = GRID_TEXT_COLOR;
  ctx.fillText(unit, 0, 0);
  ctx.restore();
};

/** Draws the x-axis line and year tick labels, spaced to avoid overlap. */
const drawXAxis = (
  ctx: CanvasRenderingContext2D,
  xScale: d3.ScaleLinear<number, number>,
  allYears: number[],
  plotW: number,
  plotH: number,
  domainXMin: number,
  domainXMax: number,
) => {
  ctx.beginPath();
  ctx.moveTo(MARGIN.left, MARGIN.top + plotH);
  ctx.lineTo(MARGIN.left + plotW, MARGIN.top + plotH);
  ctx.stroke();

  const tickYears = calculateOptimalTicksWithNiceYears(allYears, plotW);

  tickYears.forEach((year) => {
    if (year < domainXMin || year > domainXMax) return;

    const x = xScale(year);
    if (x < MARGIN.left || x > MARGIN.left + plotW) return;

    ctx.beginPath();
    ctx.moveTo(x, MARGIN.top + plotH);
    ctx.lineTo(x, MARGIN.top + plotH + 6);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = GRID_TEXT_COLOR;
    ctx.fillText(year.toString(), x, MARGIN.top + plotH + 10);
  });

  ctx.fillStyle = GRID_TEXT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const centerX = MARGIN.left + plotW / 2;
  ctx.fillText("Year", centerX, MARGIN.top + plotH + 30);
};

/**
 * Draws the complete axes frame: grid lines, y-axis, x-axis.
 */
export const drawAxesAndGrid = (
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  runs: ExtendedRun[],
  width: number,
  height: number,
) => {
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const { xScale, yScale } = scales;

  const [domainXMin, domainXMax] = xScale.domain();
  const [domainYMin, domainYMax] = yScale.domain().sort((a, b) => a - b);

  const allYears = [...new Set(runs.flatMap((r) => r.orderedPoints.map((p) => p.year)))].sort(
    (a, b) => a - b,
  );

  ctx.font = AXIS_FONT;
  ctx.strokeStyle = GRID_STROKE_COLOR;
  ctx.lineWidth = 1;

  drawGrid(ctx, yScale, plotW, domainYMin, domainYMax);
  drawYAxis(ctx, yScale, plotH, domainYMin, domainYMax, runs.length > 0 ? runs[0].unit : "");
  drawXAxis(ctx, xScale, allYears, plotW, plotH, domainXMin, domainXMax);
};
