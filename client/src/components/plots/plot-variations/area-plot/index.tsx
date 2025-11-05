"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderAreaPlot } from "@/components/plots/plot-variations/area-plot/render";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";

interface AreaChartProps {
  runs: ExtendedRun[];
  prefix?: string;
}

const BasePlot: React.FC<AreaChartProps> = ({ runs, prefix }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags, hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderAreaPlot({
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

export const AreaPlot = ({ data, prefix }: { data: RunPipelineReturn; prefix?: string }) => {
  return (
    <PlotStateHandler data={data} fieldName="runs">
      {(runs) => <BasePlot runs={runs} prefix={prefix} />}
    </PlotStateHandler>
  );
};
