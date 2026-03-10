import { ExtendedRun } from "@/types/data/run";
import { Scales, ZoomState, DEFAULT_ZOOM } from "./types";
import { clampZoom, MARGIN, Extent } from "./scales";
import { findClosestRun, SpatialIndex } from "./hit-detection";
import { drawHoverFrame } from "./hover";
import { TooltipHelpers } from "./tooltip";
import {
  DRAG_THRESHOLD,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_STEP,
} from "@/components/plots/plot-variations/canvas/constants";
import { drawAllLines } from "@/components/plots/plot-variations/canvas/lines";

interface CanvasStateRef {
  scales: Scales | null;
  spatialIndex: SpatialIndex | null;
  extent: Extent | null;
  runs: ExtendedRun[];
  zoom: ZoomState;
  hoveredRunId: string | null;
  isDragging: boolean;
  didDrag: boolean;
  dragStartX: number;
  dragStartY: number;
  dragStartZoom: ZoomState;
}

interface HandlerDeps {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  stateRef: { current: CanvasStateRef };
  selectedFlags: string[];
  hasSelection: boolean;
  tooltip: TooltipHelpers;
  renderFull: () => void;
  repaintBase: () => void;
  setZoom: (zoom: ZoomState) => void;
  onRunClick?: (run: ExtendedRun) => void;
}

/**
 * Creates all canvas event handlers. Returns the handlers plus a cleanup function.
 * Handlers read from stateRef imperatively to avoid stale closures.
 */
export const createEventHandlers = (deps: HandlerDeps) => {
  const { canvas, container, stateRef, selectedFlags, hasSelection, tooltip } = deps;
  const { renderFull, repaintBase, setZoom, onRunClick } = deps;

  let rafId: number | null = null;
  let wheelSyncTimeout: ReturnType<typeof setTimeout> | null = null;

  // ── Mouse down (start drag) ────────────────────────────────────────────

  const handleMouseDown = (e: MouseEvent) => {
    if (stateRef.current.zoom.k <= MIN_ZOOM) return;

    stateRef.current.isDragging = true;
    stateRef.current.didDrag = false;
    stateRef.current.dragStartX = e.clientX;
    stateRef.current.dragStartY = e.clientY;
    stateRef.current.dragStartZoom = { ...stateRef.current.zoom };
    canvas.style.cursor = "grabbing";

    tooltip.hide();
    stateRef.current.hoveredRunId = null;
  };

  // ── Mouse move (drag pan or hover) ─────────────────────────────────────

  const handleMouseMove = (e: MouseEvent) => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      if (stateRef.current.isDragging) {
        handleDrag(e);
      } else {
        handleHover(e);
      }
      rafId = null;
    });
  };

  const handleDrag = (e: MouseEvent) => {
    const { extent, dragStartX, dragStartY, dragStartZoom } = stateRef.current;
    if (!extent) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      stateRef.current.didDrag = true;
    }

    const rect = container.getBoundingClientRect();
    const plotW = rect.width - MARGIN.left - MARGIN.right;
    const plotH = rect.height - MARGIN.top - MARGIN.bottom;

    const xRange = extent.xMax - extent.xMin;
    const yRange = extent.yMax - extent.yMin;

    const dataPerPixelX = xRange / dragStartZoom.k / plotW;
    const dataPerPixelY = yRange / dragStartZoom.k / plotH;

    stateRef.current.zoom = clampZoom(
      {
        k: dragStartZoom.k,
        x: dragStartZoom.x - dx * dataPerPixelX,
        y: dragStartZoom.y + dy * dataPerPixelY,
      },
      extent,
    );
    renderFull();
  };

  const handleHover = (e: MouseEvent) => {
    const { scales, spatialIndex, runs } = stateRef.current;
    if (!scales || !spatialIndex || runs.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hovered = findClosestRun(mouseX, mouseY, runs, scales, spatialIndex);

    repaintBase();

    if (hovered) {
      canvas.style.cursor = "pointer";
      stateRef.current.hoveredRunId = hovered.runId;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const closestPoint = drawHoverFrame(
          ctx,
          runs,
          scales,
          hovered,
          mouseX,
          selectedFlags,
          hasSelection,
          rect.width,
          rect.height,
        );
        tooltip.updateContent(hovered, closestPoint);
        tooltip.position(mouseX, mouseY);
      }
    } else {
      canvas.style.cursor = stateRef.current.zoom.k > MIN_ZOOM ? "grab" : "default";
      stateRef.current.hoveredRunId = null;
      tooltip.hide();
      drawAllLines(
        canvas.getContext("2d")!,
        runs,
        scales,
        selectedFlags,
        hasSelection,
        rect.width,
        rect.height,
      );
    }
  };

  // ── Mouse up (end drag) ────────────────────────────────────────────────

  const handleMouseUp = () => {
    if (stateRef.current.isDragging) {
      stateRef.current.isDragging = false;
      canvas.style.cursor = stateRef.current.zoom.k > MIN_ZOOM ? "grab" : "default";
      setZoom({ ...stateRef.current.zoom });
    }
  };

  // ── Click (run selection) ──────────────────────────────────────────────

  const handleClick = (e: MouseEvent) => {
    if (!onRunClick) return;
    if (stateRef.current.didDrag) return;

    const { scales, spatialIndex, runs } = stateRef.current;
    if (!scales || !spatialIndex) return;

    const rect = canvas.getBoundingClientRect();
    const run = findClosestRun(
      e.clientX - rect.left,
      e.clientY - rect.top,
      runs,
      scales,
      spatialIndex,
    );
    if (run) onRunClick(run);
  };

  // ── Mouse leave ────────────────────────────────────────────────────────

  const handleMouseLeave = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    stateRef.current.isDragging = false;
    canvas.style.cursor = "default";
    tooltip.hide();
    stateRef.current.hoveredRunId = null;

    repaintBase();
    const ctx = canvas.getContext("2d");
    const rect = container.getBoundingClientRect();
    const { scales, runs } = stateRef.current;
    if (ctx && scales) {
      drawAllLines(ctx, runs, scales, selectedFlags, hasSelection, rect.width, rect.height);
    }
  };

  // ── Wheel zoom ─────────────────────────────────────────────────────────

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const { scales, extent } = stateRef.current;
    if (!scales || !extent) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dataX = scales.xScale.invert(mouseX);
    const dataY = scales.yScale.invert(mouseY);

    const direction = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    const prev = stateRef.current.zoom;
    const newK = Math.max(MIN_ZOOM, Math.min(prev.k * direction, MAX_ZOOM));

    let newZoom: ZoomState;
    if (newK <= MIN_ZOOM) {
      newZoom = DEFAULT_ZOOM;
    } else {
      const xCenter = (extent.xMin + extent.xMax) / 2;
      const yCenter = (extent.yMin + extent.yMax) / 2;
      const curCenterX = xCenter + prev.x;
      const curCenterY = yCenter + prev.y;
      const factor = 1 - prev.k / newK;

      newZoom = clampZoom(
        {
          k: newK,
          x: prev.x + (dataX - curCenterX) * factor,
          y: prev.y + (dataY - curCenterY) * factor,
        },
        extent,
      );
    }

    stateRef.current.zoom = newZoom;
    renderFull();

    if (wheelSyncTimeout) clearTimeout(wheelSyncTimeout);
    wheelSyncTimeout = setTimeout(() => setZoom({ ...stateRef.current.zoom }), 100);
  };

  // ── Resize ─────────────────────────────────────────────────────────────

  const handleResize = () => {
    tooltip.hide();
    stateRef.current.hoveredRunId = null;
    stateRef.current.isDragging = false;
    renderFull();
  };

  // ── Bind & cleanup ─────────────────────────────────────────────────────

  const bind = () => {
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
  };

  const cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (wheelSyncTimeout) clearTimeout(wheelSyncTimeout);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("click", handleClick);
    canvas.removeEventListener("mouseleave", handleMouseLeave);
    canvas.removeEventListener("wheel", handleWheel);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return { bind, cleanup, handleResize };
};
