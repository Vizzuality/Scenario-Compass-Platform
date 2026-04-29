"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { renderStackedWaterfallPlot } from "@/components/plots/plot-variations/waterfall/render";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";

interface BasePlotProps {
  runs: ExtendedRun[];
  variablesMap: Record<string, string>;
}

const BasePlot: React.FC<BasePlotProps> = ({ runs, variablesMap }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderStackedWaterfallPlot({ svg, dimensions, runs, variablesMap });
  }, [runs, dimensions, svgRef, variablesMap]);

  return plotContainer;
};

interface WaterfallPlotProps {
  data: RunPipelineReturn;
  variablesMap: Record<string, string>;
}

export const WaterfallPlot: React.FC<WaterfallPlotProps> = ({ data, variablesMap }) => {
  return (
    <PlotStateHandler isLoading={data.isLoading} isError={data.isError} items={data.runs}>
      {(items) => <BasePlot runs={items} variablesMap={variablesMap} />}
    </PlotStateHandler>
  );
};
