import { CanvasState, DEFAULT_ZOOM } from "@/components/plots/plot-variations/canvas/types";

export const ZOOM_STEP = 1.3;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 20;
export const DRAG_THRESHOLD = 3;
export const INITIAL_STATE: CanvasState = {
  scales: null,
  spatialIndex: null,
  extent: null,
  runs: [],
  selectedFlags: [],
  hasSelection: false,
  zoom: DEFAULT_ZOOM,
  hoveredRunId: null,
  isDragging: false,
  didDrag: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartZoom: DEFAULT_ZOOM,
};
