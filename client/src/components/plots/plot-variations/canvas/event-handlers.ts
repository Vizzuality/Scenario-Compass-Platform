import { ExtendedRun } from "@/types/data/run";
import { DEFAULT_ZOOM, Scales, ZoomState } from "./types";
import { clampZoom, Extent } from "./scales";
import { findClosestRun, SpatialIndex } from "./hit-detection";
import { drawHoverFrame } from "./hover";
import { TooltipHelpers } from "./tooltip";
import { DRAG_THRESHOLD, MARGIN, MIN_ZOOM } from "./constants";
import { renderChart } from "./renderers";

/** Minimal mutable state that event handlers read/write via ref. */
export interface CanvasStateRef {
  scales: Scales | null;
  spatialIndex: SpatialIndex | null;
  extent: Extent | null;
  runs: ExtendedRun[];
  zoom: ZoomState;
  hoveredRunId: string | null;
  selectedRun: ExtendedRun | null;
  isDragging: boolean;
  didDrag: boolean;
  dragStartX: number;
  dragStartY: number;
  dragStartZoom: ZoomState;
}

export const createInitialState = (): CanvasStateRef => ({
  scales: null,
  spatialIndex: null,
  extent: null,
  runs: [],
  zoom: DEFAULT_ZOOM,
  hoveredRunId: null,
  selectedRun: null,
  isDragging: false,
  didDrag: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartZoom: DEFAULT_ZOOM,
});

interface HandlerDeps {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  stateRef: React.MutableRefObject<CanvasStateRef>;
  selectedFlags: string[];
  hasSelection: boolean;
  tooltip: TooltipHelpers;
  setZoom: (zoom: ZoomState) => void;
  zoomEnabled: boolean;
  onSelectedRunChange?: (run: ExtendedRun | null) => void;
}

/** Check if a pixel coordinate is inside the plot area. */
const isInPlotArea = (x: number, y: number, width: number, height: number): boolean =>
  x >= MARGIN.left && x <= width - MARGIN.right && y >= MARGIN.top && y <= height - MARGIN.bottom;

export const createEventHandlers = ({
  canvas,
  container,
  stateRef,
  selectedFlags,
  hasSelection,
  tooltip,
  setZoom,
  zoomEnabled,
  onSelectedRunChange,
}: HandlerDeps) => {
  let rafId: number | null = null;
  let currentCursor = "default";

  const setCursor = (c: string) => {
    if (currentCursor !== c) {
      canvas.style.cursor = c;
      currentCursor = c;
    }
  };

  const repaint = () => {
    const { runs, extent, zoom } = stateRef.current;
    if (!extent) return;
    const result = renderChart(canvas, container, runs, extent, selectedFlags, hasSelection, zoom);
    if (result) {
      stateRef.current.scales = result.scales;
      stateRef.current.spatialIndex = result.spatialIndex;
    }
  };

  const clearSelection = () => {
    stateRef.current.selectedRun = null;
    stateRef.current.hoveredRunId = null;
    onSelectedRunChange?.(null);
    tooltip.hide();
    tooltip.setInteractive(false);
    setCursor("default");
    repaint();
  };

  const handleHover = (e: MouseEvent) => {
    const { scales, spatialIndex, runs, selectedRun } = stateRef.current;
    if (!scales || !spatialIndex || runs.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    /**
     * SELECTED MODE: tooltip snaps to data points on the selected line
     */
    if (selectedRun) {
      const plotLeft = MARGIN.left;
      const plotRight = rect.width - MARGIN.right;
      const clampedMouseX = Math.max(plotLeft, Math.min(plotRight, mouseX));

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const closestPoint = drawHoverFrame(
          ctx,
          runs,
          scales,
          selectedRun,
          clampedMouseX,
          selectedFlags,
          hasSelection,
          rect.width,
          rect.height,
        );

        const pointX = scales.xScale(closestPoint.year);
        const pointY = scales.yScale(closestPoint.value);

        if (isInPlotArea(pointX, pointY, rect.width, rect.height)) {
          tooltip.updateContent(selectedRun, closestPoint);
          tooltip.position(pointX, pointY, rect.width, rect.height);
        } else {
          tooltip.hide();
        }
      }
      return;
    }

    /**
     * IDLE MODE: highlight closest line
     */
    const hovered = findClosestRun(
      mouseX,
      mouseY,
      runs,
      scales,
      spatialIndex,
      selectedFlags,
      hasSelection,
    );

    if (hovered) {
      setCursor("pointer");
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

        const pointX = scales.xScale(closestPoint.year);
        const pointY = scales.yScale(closestPoint.value);

        if (isInPlotArea(pointX, pointY, rect.width, rect.height)) {
          tooltip.updateContent(hovered, closestPoint);
          tooltip.position(mouseX, mouseY, rect.width, rect.height);
        } else {
          tooltip.hide();
        }
      }
    } else {
      setCursor(stateRef.current.zoom.k > MIN_ZOOM ? "grab" : "default");
      stateRef.current.hoveredRunId = null;
      tooltip.hide();
      repaint();
    }
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
    const dataPerPixelX = (extent.xMax - extent.xMin) / dragStartZoom.k / plotW;
    const dataPerPixelY = (extent.yMax - extent.yMin) / dragStartZoom.k / plotH;

    stateRef.current.zoom = clampZoom(
      {
        k: dragStartZoom.k,
        x: dragStartZoom.x - dx * dataPerPixelX,
        y: dragStartZoom.y + dy * dataPerPixelY,
      },
      extent,
    );
    repaint();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      stateRef.current.isDragging ? handleDrag(e) : handleHover(e);
      rafId = null;
    });
  };

  const onMouseDown = (e: MouseEvent) => {
    if (!zoomEnabled || stateRef.current.zoom.k <= MIN_ZOOM) return;
    if (stateRef.current.selectedRun) return;

    Object.assign(stateRef.current, {
      isDragging: true,
      didDrag: false,
      dragStartX: e.clientX,
      dragStartY: e.clientY,
      dragStartZoom: { ...stateRef.current.zoom },
    });
    setCursor("grabbing");
    tooltip.hide();
  };

  const onMouseUp = () => {
    if (stateRef.current.isDragging) {
      stateRef.current.isDragging = false;
      setCursor(stateRef.current.zoom.k > MIN_ZOOM ? "grab" : "default");
      setZoom({ ...stateRef.current.zoom });
    }
  };

  const onClick = (e: MouseEvent) => {
    if (stateRef.current.didDrag) return;

    const { scales, spatialIndex, runs, selectedRun } = stateRef.current;
    if (!scales || !spatialIndex) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (selectedRun) {
      const clicked = findClosestRun(
        mouseX,
        mouseY,
        runs,
        scales,
        spatialIndex,
        selectedFlags,
        hasSelection,
      );
      if (!clicked || clicked.runId !== selectedRun.runId) {
        clearSelection();
      }
      return;
    }

    const clicked = findClosestRun(
      mouseX,
      mouseY,
      runs,
      scales,
      spatialIndex,
      selectedFlags,
      hasSelection,
    );
    if (clicked) {
      stateRef.current.selectedRun = clicked;
      onSelectedRunChange?.(clicked);
      tooltip.setInteractive(true);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const closestPoint = drawHoverFrame(
          ctx,
          runs,
          scales,
          clicked,
          mouseX,
          selectedFlags,
          hasSelection,
          rect.width,
          rect.height,
        );
        tooltip.updateContent(clicked, closestPoint);
        const pointX = scales.xScale(closestPoint.year);
        const pointY = scales.yScale(closestPoint.value);
        tooltip.position(pointX, pointY, rect.width, rect.height);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && stateRef.current.selectedRun) {
      clearSelection();
    }
  };

  const onMouseLeave = () => {
    if (rafId) cancelAnimationFrame(rafId);
    stateRef.current.isDragging = false;

    if (stateRef.current.selectedRun) return;

    setCursor("default");
    tooltip.hide();
    stateRef.current.hoveredRunId = null;
    repaint();
  };

  const preventWheel = (e: Event) => e.preventDefault();

  return {
    bind() {
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("click", onClick);
      canvas.addEventListener("mouseleave", onMouseLeave);
      canvas.addEventListener("wheel", preventWheel, { passive: false });
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("keydown", onKeyDown);
    },
    cleanup() {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
    },
  };
};
