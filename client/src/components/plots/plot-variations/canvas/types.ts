import * as d3 from "d3";
import { SpatialIndex } from "@/components/plots/plot-variations/canvas/hit-detection";
import { Extent } from "@/components/plots/plot-variations/canvas/scales";
import { ExtendedRun } from "@/types/data/run";

/**
 * Pair of D3 linear scales that map data-space values to pixel-space coordinates.
 *
 * - xScale: maps year values → horizontal pixel positions
 * - yScale: maps metric values → vertical pixel positions (inverted: higher values = lower y)
 *
 * These are recomputed on every zoom/pan/resize since the domain changes with zoom
 * and the range changes with container dimensions.
 */
export interface Scales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

/**
 * A single point stored in the D3 quadtree for spatial hit detection.
 *
 * Points are stored in pixel-space coordinates (already passed through xScale/yScale)
 * so that the quadtree search radius corresponds directly to screen distance.
 *
 * - x, y:       pixel coordinates of this data point on the canvas
 * - runIndex:   index into the runs array, linking this point back to its parent line
 *
 * The quadtree is rebuilt whenever scales change (zoom, pan, resize, data change)
 * because pixel positions shift with scale changes.
 */
export interface QuadtreePoint {
  x: number;
  y: number;
  runIndex: number;
}

/**
 * Describes the current zoom/pan state of the chart in data-space terms.
 *
 * - k: scale factor. 1 = fit all data, 2 = show middle 50%, 4 = show middle 25%, etc.
 * - x: horizontal pan offset in data-space units (e.g. years). Shifts the viewport
 *       center relative to the data midpoint. Positive = shifted right.
 * - y: vertical pan offset in data-space units. Positive = shifted up.
 *
 * Pan offsets are clamped by `clampZoom()` so the viewport edges never exceed
 * the data extent, preventing the user from panning into empty space.
 *
 * At k=1, pan has no effect (maxPan = 0) — the full data range is visible.
 */
export interface ZoomState {
  k: number;
  x: number;
  y: number;
}

/** No zoom, no pan — shows the full data extent. */
export const DEFAULT_ZOOM: ZoomState = { k: 1, x: 0, y: 0 };

export interface CanvasState {
  scales: Scales | null;
  spatialIndex: SpatialIndex | null;
  extent: Extent | null;
  runs: ExtendedRun[];
  selectedFlags: string[];
  hasSelection: boolean;
  zoom: ZoomState;
  hoveredRunId: string | null;
  isDragging: boolean;
  didDrag: boolean;
  dragStartX: number;
  dragStartY: number;
  dragStartZoom: ZoomState;
}
