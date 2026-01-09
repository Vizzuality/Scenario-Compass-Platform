"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { renderMultiLinePlot } from "@/components/plots/plot-variations/multi-line/render";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";

interface Props {
  runs: ExtendedRun[];
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

const BasePlot: React.FC<Props> = ({ runs, prefix, onRunClick }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderMultiLinePlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
      onRunClick,
    });
  }, [runs, dimensions, selectedFlags, onRunClick, svgRef]);

  return plotContainer;
};

interface MultiLinePlotProps {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

export const MultiLinePlot: React.FC<MultiLinePlotProps> = ({ data, prefix, onRunClick }) => {
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);
  const visibleRuns = filterVisibleRuns(data.runs, hiddenFlags, showVetting);
  return (
    <PlotStateHandler isError={data.isError} isLoading={data.isLoading} items={visibleRuns}>
      {(items) => <BasePlot runs={items} prefix={prefix} onRunClick={onRunClick} />}
    </PlotStateHandler>
  );
};
