"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { filterDecadePoints, filterVisibleRuns } from "@/utils/plots/filtering-functions";
import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";

import { DEFAULT_ZOOM, ZoomState } from "./types";
import { CanvasStateRef } from "./event-handlers";
import { computeExtent } from "./scales";
import { createTooltipHelpers } from "./tooltip";
import { createEventHandlers } from "./event-handlers";
import { ZoomControls } from "./zoom-controls";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "./constants";
import { renderChart } from "./renderers";
import { useRouter } from "next/navigation";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";

interface Props {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
  zoomEnabled?: boolean;
}

const createInitialState = (): CanvasStateRef => ({
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

export const CanvasMultiLinePlot: React.FC<Props> = ({
  data,
  prefix,
  onRunClick,
  zoomEnabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { selectedFlags, hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);
  const decadeFilteredRuns = filterDecadePoints(data.runs);

  const router = useRouter();
  const buildRunDetailsUrl = useGetRunDetailsUrl();

  const [zoom, setZoom] = useState<ZoomState>(DEFAULT_ZOOM);
  const stateRef = useRef<CanvasStateRef>(createInitialState());

  const applyZoom = useCallback(
    (newZoom: ZoomState) => {
      stateRef.current.zoom = newZoom;
      const { runs, extent } = stateRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container && extent && runs.length > 0) {
        const result = renderChart(
          canvas,
          container,
          runs,
          extent,
          selectedFlags,
          selectedFlags.length > 0,
          newZoom,
        );
        if (result) {
          stateRef.current.scales = result.scales;
          stateRef.current.spatialIndex = result.spatialIndex;
        }
      }
      setZoom(newZoom);
    },
    [selectedFlags],
  );

  const zoomIn = useCallback(() => {
    if (!zoomEnabled) return;
    const prev = stateRef.current.zoom;
    applyZoom({ ...prev, k: Math.min(prev.k * ZOOM_STEP, MAX_ZOOM) });
  }, [applyZoom, zoomEnabled]);

  const zoomOut = useCallback(() => {
    if (!zoomEnabled) return;
    const prev = stateRef.current.zoom;
    const newK = prev.k / ZOOM_STEP;
    applyZoom(newK <= MIN_ZOOM ? DEFAULT_ZOOM : { ...prev, k: newK });
  }, [applyZoom, zoomEnabled]);

  const zoomReset = useCallback(() => {
    if (!zoomEnabled) return;
    applyZoom(DEFAULT_ZOOM);
  }, [applyZoom, zoomEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!canvas || !container || !tooltipEl || !data.runs) return;

    const runs = filterVisibleRuns(decadeFilteredRuns, hiddenFlags, showVetting);
    const hasSelection = selectedFlags.length > 0;
    const extent = computeExtent(runs);

    Object.assign(stateRef.current, { runs, extent, hoveredRunId: null, selectedRun: null });

    if (runs.length === 0) return;

    const tooltip = createTooltipHelpers(tooltipEl, onRunClick, (run) => {
      const url = buildRunDetailsUrl(run);
      router.prefetch(url);
    });

    const { bind, cleanup } = createEventHandlers({
      canvas,
      container,
      stateRef,
      selectedFlags,
      hasSelection,
      tooltip,
      setZoom,
      onRunClick,
      zoomEnabled,
    });

    const doRender = () => {
      const result = renderChart(
        canvas,
        container,
        runs,
        extent,
        selectedFlags,
        hasSelection,
        stateRef.current.zoom,
      );
      if (result) {
        stateRef.current.scales = result.scales;
        stateRef.current.spatialIndex = result.spatialIndex;
      }
    };

    let pendingRaf: number | null = null;
    let lastWidth = 0;
    let lastHeight = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      if (pendingRaf) cancelAnimationFrame(pendingRaf);

      pendingRaf = requestAnimationFrame(() => {
        const currentRect = container.getBoundingClientRect();
        if (
          Math.abs(currentRect.width - lastWidth) > 1 ||
          Math.abs(currentRect.height - lastHeight) > 1
        ) {
          lastWidth = currentRect.width;
          lastHeight = currentRect.height;
          pendingRaf = requestAnimationFrame(doRender);
        } else {
          doRender();
        }
      });
    });

    resizeObserver.observe(container);
    bind();

    return () => {
      if (pendingRaf) cancelAnimationFrame(pendingRaf);
      cleanup();
      resizeObserver.disconnect();
    };
  }, [data.runs, selectedFlags, hiddenFlags, showVetting, onRunClick, zoomEnabled]);

  const aspectClasses =
    "relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10]";

  if (data.isLoading) {
    return (
      <div className={aspectClasses}>
        <LoadingDots />
      </div>
    );
  }

  if (data.isError) {
    return (
      <div className={aspectClasses}>
        <DataFetchError />
      </div>
    );
  }

  if (!data.runs || data.runs.length === 0) {
    return (
      <div className={aspectClasses}>
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
    <div className="relative aspect-square w-full flex-1 sm:aspect-[4/3] lg:aspect-[16/10]">
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" />
        {zoomEnabled && (
          <ZoomControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={zoomReset}
            canZoomOut={zoom.k > MIN_ZOOM}
          />
        )}
        <div ref={tooltipRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};
