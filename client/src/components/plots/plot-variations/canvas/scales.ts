import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { Scales, ZoomState } from "./types";
import { MARGIN } from "./constants";

export interface Extent {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Computes the bounding box of all data points across all runs. */
export const computeExtent = (runs: ExtendedRun[]): Extent => {
  const allPoints = runs.flatMap((r) => r.orderedPoints);
  const [xMin, xMax] = d3.extent(allPoints, (d) => d.year) as [number, number];
  const [yMin, yMax] = d3.extent(allPoints, (d) => d.value) as [number, number];
  const padding = (yMax - yMin) * 0.1;

  return { xMin, xMax, yMin: yMin - padding, yMax: yMax + padding };
};

/** Clamps zoom pan offsets so the viewport never exceeds the data extent. */
export const clampZoom = (zoom: ZoomState, extent: Extent): ZoomState => {
  const xHalf = (extent.xMax - extent.xMin) / (2 * zoom.k);
  const yHalf = (extent.yMax - extent.yMin) / (2 * zoom.k);
  const maxPanX = Math.max(0, (extent.xMax - extent.xMin) / 2 - xHalf);
  const maxPanY = Math.max(0, (extent.yMax - extent.yMin) / 2 - yHalf);

  return {
    k: zoom.k,
    x: Math.max(-maxPanX, Math.min(maxPanX, zoom.x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, zoom.y)),
  };
};

/** Maps data values → pixel positions, incorporating zoom and pan. */
export const computeScales = (
  extent: Extent,
  width: number,
  height: number,
  zoom: ZoomState,
): Scales => {
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const clamped = clampZoom(zoom, extent);

  const xCenter = (extent.xMin + extent.xMax) / 2 + clamped.x;
  const yCenter = (extent.yMin + extent.yMax) / 2 + clamped.y;
  const xHalf = (extent.xMax - extent.xMin) / (2 * zoom.k);
  const yHalf = (extent.yMax - extent.yMin) / (2 * zoom.k);

  return {
    xScale: d3
      .scaleLinear()
      .domain([xCenter - xHalf, xCenter + xHalf])
      .range([MARGIN.left, MARGIN.left + plotW]),
    yScale: d3
      .scaleLinear()
      .domain([yCenter - yHalf, yCenter + yHalf])
      .range([MARGIN.top + plotH, MARGIN.top]),
  };
};
