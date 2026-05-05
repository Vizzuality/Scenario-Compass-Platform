"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { renderStackedAreaPlot } from "@/components/plots/plot-variations/stacked-area/render";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";

interface Props {
  runs: ExtendedRun[];
  variablesMap: Record<string, string>;
}

const BasePlot: React.FC<Props> = ({ runs, variablesMap }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { setSelectedRunId } = useSelectedRunParam();

  const currentRunId = runs?.[0]?.runId || runs?.[0]?.runId;

  useEffect(() => {
    if (currentRunId) {
      setSelectedRunId(currentRunId);
    }
  }, [currentRunId, setSelectedRunId]);

  useEffect(() => {
    if (!runs || runs.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const cleanup = renderStackedAreaPlot({
      svg,
      dimensions,
      runs,
      variablesMap,
    });

    return () => {
      if (cleanup) cleanup();
    };
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
    <PlotStateHandler isLoading={data.isLoading} isError={data.isError} items={data.runs}>
      {(items) => <BasePlot runs={items} variablesMap={variablesMap} />}
    </PlotStateHandler>
  );
};
