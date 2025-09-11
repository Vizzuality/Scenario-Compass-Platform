"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { renderStackedAreaPlot } from "@/components/plots/plot-variations/stacked-area/utils";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { PlotStateHandler } from "@/components/plots/components";

interface Props {
  runs: ExtendedRun[];
  variablesMap: Record<string, string>;
}

const BasePlot: React.FC<Props> = ({ runs, variablesMap }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!runs || runs.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    renderStackedAreaPlot({
      svg,
      dimensions,
      runs,
      variablesMap,
    });
  }, [runs, dimensions, svgRef, variablesMap]);

  return plotContainer;
};

export const StackedAreaPlot = ({
  data,
  variablesMap,
}: {
  data: RunPipelineReturn;
  variablesMap: Record<string, string>;
}) => {
  return (
    <PlotStateHandler data={data}>
      {(runs) => <BasePlot runs={runs} variablesMap={variablesMap} />}
    </PlotStateHandler>
  );
};
