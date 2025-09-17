"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderAreaPlot } from "@/components/plots/plot-variations/area-plot/utils";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { PlotStateHandler } from "@/components/plots/components";

interface AreaChartProps {
  runs: ExtendedRun[];
}

const BasePlot: React.FC<AreaChartProps> = ({ runs }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderAreaPlot({
      svg,
      runs,
      dimensions,
    });
  }, [dimensions, runs, svgRef]);

  return plotContainer;
};

export const AreaPlot = ({ data }: { data: RunPipelineReturn }) => {
  return (
    <PlotStateHandler data={data} fieldName="runs">
      {(runs) => <BasePlot runs={runs} />}
    </PlotStateHandler>
  );
};
