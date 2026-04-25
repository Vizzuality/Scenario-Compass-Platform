"use client";

import React, { useCallback, useEffect, useEffectEvent, useRef } from "react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { filterDecadePoints, filterVisibleRuns } from "@/utils/plots/filtering-functions";
import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";

import { CanvasStateRef, createInitialState } from "./event-handlers";
import { computeExtentWithPadding, YExtentPair } from "./scales";
import { createTooltipHelpers, TooltipHelpers } from "./tooltip";
import { createEventHandlers } from "./event-handlers";
import { ZoomControls } from "./zoom-controls";
import { MIN_ZOOM } from "./constants";
import { renderChart } from "./renderers";
import { useRouter } from "next/navigation";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { useCanvasPlotZoom } from "@/hooks/plots/use-canvas-plot-zoom";

interface Props {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick: (run: ExtendedRun) => void;
  zoomEnabled?: boolean;
  selectedRun?: ExtendedRun | null;
  onSelectedRunChange: (run: ExtendedRun | null) => void;
  yExtent?: YExtentPair;
}

export const CanvasMultiLinePlot: React.FC<Props> = ({
  data,
  prefix,
  onRunClick,
  zoomEnabled = false,
  selectedRun: externalSelectedRun,
  onSelectedRunChange,
  yExtent,
}) => {
  const { selectedFlags, hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);
  const router = useRouter();
  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<CanvasStateRef>(createInitialState());
  const tooltipInstanceRef = useRef<TooltipHelpers | null>(null);

  const handleSelectedRunChange = useEffectEvent((run: ExtendedRun | null) => {
    onSelectedRunChange(run);
  });

  const handleRunClick = useEffectEvent((run: ExtendedRun) => {
    onRunClick(run);
  });

  const handlePrefetch = useEffectEvent((run: ExtendedRun) => {
    router.prefetch(buildRunDetailsUrl(run));
  });

  /**
   * CORE RENDER FUNCTION
   * Memoized to be called by various effects
   */
  const doRender = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const { runs, extent, zoom: currentZoom } = stateRef.current;

    if (!canvas || !container || !runs || runs.length === 0 || !extent) return;

    const result = renderChart(
      canvas,
      container,
      runs,
      extent,
      selectedFlags,
      selectedFlags.length > 0,
      currentZoom,
    );

    if (result) {
      stateRef.current.scales = result.scales;
      stateRef.current.spatialIndex = result.spatialIndex;
    }
  }, [selectedFlags]);

  /**
   * ZOOM HOOK
   */
  const { zoom, setZoom, zoomIn, zoomOut, zoomReset } = useCanvasPlotZoom(
    stateRef,
    doRender,
    zoomEnabled,
  );

  /**
   * GRANULAR EFFECT: DATA & FILTER SYNC
   */
  useEffect(() => {
    if (!data.runs) return;

    const decadeFilteredRuns = filterDecadePoints(data.runs);
    const visibleRuns = filterVisibleRuns(decadeFilteredRuns, hiddenFlags, showVetting);
    const extent = computeExtentWithPadding(visibleRuns, yExtent);

    Object.assign(stateRef.current, {
      runs: visibleRuns,
      extent: extent,
    });

    doRender();
  }, [data.runs, hiddenFlags, showVetting, yExtent, doRender]);

  /**
   * GRANULAR EFFECT: SELECTION SYNC
   * Handles synchronization between Widget and Dialog
   */
  useEffect(() => {
    const isSelected = !!externalSelectedRun;
    stateRef.current.selectedRun = externalSelectedRun ?? null;
    tooltipInstanceRef.current?.setInteractive(isSelected);

    doRender();
  }, [externalSelectedRun, doRender]);

  /**
   * GRANULAR EFFECT: INFRASTRUCTURE SETUP
   * Handles DOM listeners and observers
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!canvas || !container || !tooltipEl) return;

    const tooltip = createTooltipHelpers(
      tooltipEl,
      (run) => handleRunClick(run),
      (run) => handlePrefetch(run),
      () => {
        // Clear selection logic
        stateRef.current.selectedRun = null;
        handleSelectedRunChange(null);
        tooltipInstanceRef.current?.setInteractive(false);
        doRender();
      },
    );

    tooltipInstanceRef.current = tooltip;

    if (stateRef.current.selectedRun) {
      tooltip.setInteractive(true);
    }

    const { bind, cleanup } = createEventHandlers({
      canvas,
      container,
      stateRef,
      selectedFlags,
      hasSelection: selectedFlags.length > 0,
      tooltip,
      setZoom,
      zoomEnabled,
      onSelectedRunChange: (run) => handleSelectedRunChange(run),
    });

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(doRender);
    });

    resizeObserver.observe(container);
    bind();

    return () => {
      cleanup();
      resizeObserver.disconnect();
      tooltipInstanceRef.current = null;
    };
  }, [zoomEnabled, selectedFlags, doRender, setZoom]);

  const aspectClasses =
    "relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10]";

  if (data.isLoading)
    return (
      <div className={aspectClasses}>
        <LoadingDots />
      </div>
    );

  if (data.isError)
    return (
      <div className={aspectClasses}>
        <DataFetchError />
      </div>
    );

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
          <p className="leading-5 text-stone-600">Try adjusting the filters to see results.</p>
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
