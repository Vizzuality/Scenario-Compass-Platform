import { ExtendedRun } from "@/types/data/run";
import { formatShortenedNumber } from "@/utils/plots/format-functions";
import { Scales } from "./types";
import { calculateOptimalTicksWithNiceYears } from "@/utils/plots/ticks-computation";
import { GRID_STROKE_COLOR, GRID_TEXT_COLOR } from "@/lib/config/plots/plots-constants";
import { MARGIN } from "./constants";

const AXIS_FONT = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const GRID_LINES_NUMBER = 6;

const CONFIG = {
  Y_AXIS: { TICK_SIZE: 1, LABEL_PADDING: 5, UNIT_LABEL_X_POS: 10 },
  X_AXIS: { TICK_SIZE: 6, LABEL_PADDING: 10, TITLE_PADDING: 28 },
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  yScale: Scales["yScale"],
  plotW: number,
  domainYMin: number,
  domainYMax: number,
) => {
  yScale.ticks(GRID_LINES_NUMBER).forEach((tick) => {
    if (tick < domainYMin || tick > domainYMax) return;
    const y = yScale(tick);
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, y);
    ctx.lineTo(MARGIN.left + plotW, y);
    ctx.stroke();
  });
};

const drawYAxis = (
  ctx: CanvasRenderingContext2D,
  yScale: Scales["yScale"],
  plotH: number,
  domainYMin: number,
  domainYMax: number,
  unit: string,
) => {
  ctx.beginPath();
  ctx.moveTo(MARGIN.left, MARGIN.top);
  ctx.lineTo(MARGIN.left, MARGIN.top + plotH);
  ctx.stroke();

  yScale.ticks(GRID_LINES_NUMBER).forEach((tick) => {
    if (tick < domainYMin || tick > domainYMax) return;
    const y = yScale(tick);
    ctx.beginPath();
    ctx.moveTo(MARGIN.left - CONFIG.Y_AXIS.TICK_SIZE, y);
    ctx.lineTo(MARGIN.left, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillStyle = GRID_TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.fillText(formatShortenedNumber(tick), MARGIN.left - CONFIG.Y_AXIS.LABEL_PADDING, y);
  });

  ctx.save();
  ctx.translate(CONFIG.Y_AXIS.UNIT_LABEL_X_POS, MARGIN.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = GRID_TEXT_COLOR;
  ctx.fillText(unit, 0, 0);
  ctx.restore();
};

const drawXAxis = (
  ctx: CanvasRenderingContext2D,
  xScale: Scales["xScale"],
  allYears: number[],
  plotW: number,
  plotH: number,
  domainXMin: number,
  domainXMax: number,
) => {
  const axisY = MARGIN.top + plotH;

  ctx.beginPath();
  ctx.moveTo(MARGIN.left, axisY);
  ctx.lineTo(MARGIN.left + plotW, axisY);
  ctx.stroke();

  calculateOptimalTicksWithNiceYears(allYears, plotW).forEach((year) => {
    if (year < domainXMin || year > domainXMax) return;
    const x = xScale(year);
    if (x < MARGIN.left || x > MARGIN.left + plotW) return;

    ctx.beginPath();
    ctx.moveTo(x, axisY);
    ctx.lineTo(x, axisY + CONFIG.X_AXIS.TICK_SIZE);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = GRID_TEXT_COLOR;
    ctx.fillText(year.toString(), x, axisY + CONFIG.X_AXIS.LABEL_PADDING);
  });

  ctx.fillStyle = GRID_TEXT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Year", MARGIN.left + plotW / 2, axisY + CONFIG.X_AXIS.TITLE_PADDING);
};

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
  drawYAxis(ctx, yScale, plotH, domainYMin, domainYMax, runs[0]?.unit ?? "");
  drawXAxis(ctx, xScale, allYears, plotW, plotH, domainXMin, domainXMax);

  // Top border
  ctx.beginPath();
  ctx.moveTo(MARGIN.left, MARGIN.top);
  ctx.lineTo(MARGIN.left + plotW, MARGIN.top);
  ctx.stroke();

  // Right border
  ctx.beginPath();
  ctx.moveTo(MARGIN.left + plotW, MARGIN.top);
  ctx.lineTo(MARGIN.left + plotW, MARGIN.top + plotH);
  ctx.stroke();
};
