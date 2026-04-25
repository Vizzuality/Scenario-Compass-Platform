"use client";

import React, { useEffect, useEffectEvent } from "react";
import * as d3 from "d3";
import { renderDotPlot } from "@/components/plots/plot-variations/dot-plot/render";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { useRouter } from "next/navigation";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";

interface DotBasePlotProps {
  runs: ExtendedRun[];
  prefix?: string;
  onRunClick: (run: ExtendedRun) => void;
  selectedRun?: ExtendedRun | null;
  onSelectedRunChange?: (run: ExtendedRun | null) => void;
  yExtent?: YExtentPair;
}

export const DotBasePlot: React.FC<DotBasePlotProps> = ({
  runs,
  prefix,
  onRunClick,
  selectedRun,
  onSelectedRunChange,
  yExtent,
}) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags } = useScenarioFlagsSelection(prefix);
  const router = useRouter();
  const buildRunDetailsUrl = useGetRunDetailsUrl();

  const handleRunClick = useEffectEvent((run: ExtendedRun) => {
    onRunClick(run);
  });

  const handleSelectedRunChange = useEffectEvent((run: ExtendedRun | null) => {
    onSelectedRunChange?.(run);
  });

  const handlePrefetch = useEffectEvent((run: ExtendedRun) => {
    router.prefetch(buildRunDetailsUrl(run));
  });

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderDotPlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
      selectedRun,
      yExtent,
      onRunClick: handleRunClick,
      onSelectedRunChange: handleSelectedRunChange,
      onPrefetch: handlePrefetch,
    });
  }, [dimensions, runs, selectedFlags, selectedRun, yExtent]);

  return plotContainer;
};

interface DotPlotProps {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick: (run: ExtendedRun) => void;
  selectedRun: ExtendedRun | null;
  onSelectedRunChange?: (run: ExtendedRun | null) => void;
  yExtent?: YExtentPair;
}

export const DotPlot: React.FC<DotPlotProps> = ({
  data,
  prefix,
  onRunClick,
  selectedRun,
  onSelectedRunChange,
  yExtent,
}) => {
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);
  const visibleRuns = filterVisibleRuns(data.runs, hiddenFlags, showVetting);

  return (
    <PlotStateHandler items={visibleRuns} isLoading={data.isLoading} isError={data.isError}>
      {(items) => (
        <DotBasePlot
          runs={items}
          prefix={prefix}
          onRunClick={onRunClick}
          selectedRun={selectedRun}
          onSelectedRunChange={onSelectedRunChange}
          yExtent={yExtent}
        />
      )}
    </PlotStateHandler>
  );
};
