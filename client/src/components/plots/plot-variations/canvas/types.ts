import * as d3 from "d3";

export interface Scales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export interface QuadtreePoint {
  x: number;
  y: number;
  runIndex: number;
}

export interface ZoomState {
  k: number;
  x: number;
  y: number;
}

export const DEFAULT_ZOOM: ZoomState = { k: 1, x: 0, y: 0 };
