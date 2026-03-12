"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";
import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";

import { CanvasState, DEFAULT_ZOOM, ZoomState } from "./types";
import { computeExtent } from "./scales";
import { createRenderers } from "./renderers";
import { createTooltipHelpers } from "./tooltip";
import { createEventHandlers } from "./event-handlers";
import { ZoomControls } from "./zoom-controls";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "@/components/plots/plot-variations/canvas/constants";

interface Props {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
  showZoomControls?: boolean;
}

const createInitialState = (): CanvasState => ({
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
});

export const CanvasMultiLinePlot: React.FC<Props> = ({
  data,
  prefix,
  onRunClick,
  showZoomControls = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { selectedFlags, hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);

  const [zoom, setZoom] = useState<ZoomState>(DEFAULT_ZOOM);
  const stateRef = useRef<CanvasState>(createInitialState());
  const renderFullRef = useRef<(() => void) | null>(null);

  const applyZoom = useCallback((newZoom: ZoomState) => {
    stateRef.current.zoom = newZoom;
    renderFullRef.current?.();
    setZoom(newZoom);
  }, []);

  const zoomIn = useCallback(() => {
    const prev = stateRef.current.zoom;
    applyZoom({ ...prev, k: Math.min(prev.k * ZOOM_STEP, MAX_ZOOM) });
  }, [applyZoom]);

  const zoomOut = useCallback(() => {
    const prev = stateRef.current.zoom;
    const newK = prev.k / ZOOM_STEP;
    applyZoom(newK <= MIN_ZOOM ? DEFAULT_ZOOM : { ...prev, k: newK });
  }, [applyZoom]);

  const zoomReset = useCallback(() => {
    applyZoom(DEFAULT_ZOOM);
  }, [applyZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!canvas || !container || !tooltipEl || !data.runs) return;

    const runs = filterVisibleRuns(data.runs, hiddenFlags, showVetting);
    const hasSelection = selectedFlags.length > 0;
    const extent = computeExtent(runs);

    Object.assign(stateRef.current, {
      runs,
      selectedFlags,
      hasSelection,
      extent,
      hoveredRunId: null,
    });

    if (runs.length === 0) return;

    const tooltip = createTooltipHelpers(tooltipEl, container);

    const { renderFull, repaintBase } = createRenderers({
      canvas,
      container,
      runs,
      extent,
      selectedFlags,
      hasSelection,
      getZoom: () => stateRef.current.zoom,
      getScales: () => stateRef.current.scales,
      setComputed: (scales, spatialIndex) => {
        stateRef.current.scales = scales;
        stateRef.current.spatialIndex = spatialIndex;
      },
    });

    renderFullRef.current = renderFull;

    const { bind, cleanup, handleResize } = createEventHandlers({
      canvas,
      container,
      stateRef,
      selectedFlags,
      hasSelection,
      tooltip,
      renderFull,
      repaintBase,
      setZoom,
      onRunClick,
    });

    // Initial render (deferred one frame for dialog layout)
    const initialRafId = requestAnimationFrame(renderFull);

    // Resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Bind all event listeners
    bind();

    return () => {
      cancelAnimationFrame(initialRafId);
      cleanup();
      resizeObserver.disconnect();
      renderFullRef.current = null;
    };
  }, [data.runs, selectedFlags, hiddenFlags, showVetting, onRunClick]);

  if (data.isLoading) {
    return (
      <div className="relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10]">
        <LoadingDots />
      </div>
    );
  }

  if (data.isError) {
    return (
      <div className="relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10]">
        <DataFetchError />
      </div>
    );
  }

  if (!data.runs || data.runs.length === 0) {
    return (
      <div className="relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10]">
        <div className="-mt-10 px-4 text-center">
          <Image
            src={notFoundImage}
            alt="No results"
            width={160}
            height={128}
            className="mx-auto"
          />
          <p className="font-bold">No results available</p>
          <p className="leading-5 text-stone-600">
            There are no runs available for the selected combination of parameters. Try adjusting
            the filters to see results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="h-full w-full" />
        {showZoomControls && (
          <ZoomControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={zoomReset}
            canZoomOut={zoom.k > MIN_ZOOM}
          />
        )}
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            display: "none",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </div>
  );
};
