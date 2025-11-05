"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderDotPlot } from "@/components/plots/plot-variations/dot-plot/render";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";

interface DotPlotProps {
  runs: ExtendedRun[];
  prefix?: string;
}

export const BasePlot: React.FC<DotPlotProps> = ({ runs, prefix }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags, hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderDotPlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
      hiddenFlags,
      showVetting,
    });
  }, [dimensions, hiddenFlags, runs, selectedFlags, showVetting, svgRef]);

  return plotContainer;
};

interface Props {
  data: RunPipelineReturn;
  prefix?: string;
}

export const DotPlot: React.FC<Props> = ({ data, prefix }) => {
  return (
    <PlotStateHandler data={data} fieldName="runs">
      {(runs) => <BasePlot runs={runs} prefix={prefix} />}
    </PlotStateHandler>
  );
};
