import { ExtendedRun } from "@/types/data/run";
import { ZoomState, Scales } from "./types";
import { computeScales, Extent } from "./scales";
import { setupCanvas } from "./canvas-utils";
import { buildSpatialIndex, SpatialIndex } from "./hit-detection";
import { drawAxesAndGrid } from "./axes";
import { drawAllLines } from "./lines";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";
import { getRunColor } from "@/utils/plots/colors-functions";
import { MARGIN } from "./constants";
import { formatShortenedNumber } from "@/utils/plots/format-functions";

export type ColorFn = (run: ExtendedRun) => string;

export interface ThresholdGuide {
  year: number;
  value: number;
  label: string;
  color: string;
}

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
  thresholdGuides?: ThresholdGuide[],
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
  drawThresholdGuides(ctx, scales, rect.width, rect.height, thresholdGuides);

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

export const drawThresholdGuides = (
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  width: number,
  height: number,
  guides?: ThresholdGuide[],
) => {
  if (!guides?.length) return;

  const plotLeft = MARGIN.left;
  const plotRight = width - MARGIN.right;
  const plotTop = MARGIN.top;
  const plotBottom = height - MARGIN.bottom;
  const [domainXMin, domainXMax] = scales.xScale.domain();
  const [domainYMin, domainYMax] = scales.yScale.domain().sort((a, b) => a - b);
  const guideYear = guides[0].year;

  if (guideYear < domainXMin || guideYear > domainXMax) return;

  const x = scales.xScale(guideYear);
  if (x < plotLeft || x > plotRight) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(plotLeft, plotTop, plotRight - plotLeft, plotBottom - plotTop);
  ctx.clip();

  ctx.strokeStyle = "rgba(17, 24, 39, 0.45)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, plotTop);
  ctx.lineTo(x, plotBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "middle";

  guides.forEach((guide) => {
    if (guide.value < domainYMin || guide.value > domainYMax) return;

    const y = scales.yScale(guide.value);
    const label = `${guide.label}: ${guide.value}`;
    const side = guide.label.toLowerCase().startsWith("high") ? "left" : "right";
    const labelY = y;
    const pillPaddingX = 8;
    const pillPaddingY = 5;
    const dotRadius = 4;
    const dotGap = 6;
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const pillHeight = 22;
    const pillWidth = textWidth + pillPaddingX * 2 + dotRadius * 2 + dotGap;
    const pillOffsetFromLine = 24;
    const rawPillX = side === "left" ? x - pillWidth - pillOffsetFromLine : x + pillOffsetFromLine;
    const pillX = Math.min(Math.max(rawPillX, plotLeft + 4), plotRight - pillWidth - 4);
    const pillY = Math.min(
      Math.max(labelY - pillHeight / 2, plotTop + 4),
      plotBottom - pillHeight - 4,
    );

    ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.lineTo(x + 9, y);
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 10);
    ctx.fill();

    ctx.fillStyle = guide.color;
    ctx.beginPath();
    ctx.arc(pillX + pillPaddingX + dotRadius, pillY + pillHeight / 2, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(label, pillX + pillPaddingX + dotRadius * 2 + dotGap, pillY + pillHeight / 2);
  });

  ctx.restore();
};
