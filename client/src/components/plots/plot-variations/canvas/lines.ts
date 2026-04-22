import { ExtendedRun } from "@/types/data/run";
import { getRunColor } from "@/utils/plots/colors-functions";
import { PLOT_CONFIG } from "@/lib/config/plots/plots-constants";
import { Scales } from "./types";
import { MARGIN } from "./constants";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";

/** Sets a clip region to the plot area. Always pair with ctx.restore(). */
export const setPlotClip = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    MARGIN.left,
    MARGIN.top,
    width - MARGIN.left - MARGIN.right,
    height - MARGIN.top - MARGIN.bottom,
  );
  ctx.clip();
};

/** Draws a single run's line. */
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
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
};

/** Draws all runs inside a clipped plot area. */
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

  /**
   * Split the runs into two groups, this allows us to draw the active ones on top of the dimmed lines
   */
  const backgroundRuns: ExtendedRun[] = [];
  const activeRuns: ExtendedRun[] = [];

  runs.forEach((run) => {
    const abbrev = getCategoryAbbrev(run.flagCategory);
    const isActive = !hasSelection || (abbrev && selectedFlags.includes(abbrev));

    if (isActive) {
      activeRuns.push(run);
    } else {
      backgroundRuns.push(run);
    }
  });

  /**
   * PASS 1: Draw dimmed lines first (the "bottom" layer)
   */
  backgroundRuns.forEach((run) => {
    drawLine(
      ctx,
      run,
      scales,
      getRunColor(run, selectedFlags, hasSelection),
      PLOT_CONFIG.NORMAL_STROKE_WIDTH,
      PLOT_CONFIG.NORMAL_OPACITY,
    );
  });

  /**
   * PASS 2: Draw active lines last (the "top" layer)
   */
  activeRuns.forEach((run) => {
    drawLine(
      ctx,
      run,
      scales,
      getRunColor(run, selectedFlags, hasSelection),
      PLOT_CONFIG.NORMAL_STROKE_WIDTH,
      1.0,
    );
  });

  ctx.globalAlpha = 1;
  ctx.restore();
};
