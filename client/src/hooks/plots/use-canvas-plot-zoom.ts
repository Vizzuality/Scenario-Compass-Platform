import { useState, useCallback, RefObject } from "react";
import { CanvasStateRef } from "@/components/plots/plot-variations/canvas/event-handlers";
import { DEFAULT_ZOOM, ZoomState } from "@/components/plots/plot-variations/canvas/types";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "@/components/plots/plot-variations/canvas/constants";

export function useCanvasPlotZoom(
  stateRef: RefObject<CanvasStateRef>,
  doRender: () => void,
  enabled: boolean,
) {
  const [zoom, setZoom] = useState<ZoomState>(DEFAULT_ZOOM);

  const applyZoom = useCallback(
    (newZoom: ZoomState) => {
      if (!stateRef.current) return;
      stateRef.current.zoom = newZoom;
      doRender();
      setZoom(newZoom);
    },
    [stateRef, doRender],
  );

  const zoomIn = useCallback(() => {
    if (!enabled) return;
    const prev = stateRef.current?.zoom || DEFAULT_ZOOM;
    applyZoom({ ...prev, k: Math.min(prev.k * ZOOM_STEP, MAX_ZOOM) });
  }, [applyZoom, enabled, stateRef]);

  const zoomOut = useCallback(() => {
    if (!enabled) return;
    const prev = stateRef.current?.zoom || DEFAULT_ZOOM;
    const newK = prev.k / ZOOM_STEP;
    applyZoom(newK <= MIN_ZOOM ? DEFAULT_ZOOM : { ...prev, k: newK });
  }, [applyZoom, enabled, stateRef]);

  const zoomReset = useCallback(() => {
    if (!enabled) return;
    applyZoom(DEFAULT_ZOOM);
  }, [applyZoom, enabled]);

  return { zoom, setZoom, zoomIn, zoomOut, zoomReset };
}
