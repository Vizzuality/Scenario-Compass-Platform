"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderAreaPlot } from "@/components/plots/plot-variations/area-plot/render";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/types/data/run";
import { PlotStateHandler } from "@/components/plots/components";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { filterDecadePoints, filterVisibleRuns } from "@/utils/plots/filtering-functions";
import { interpolatePoints } from "@/utils/plots/render-functions";

interface AreaChartProps {
  runs: ExtendedRun[];
  prefix?: string;
}

const AreaBasePlot: React.FC<AreaChartProps> = ({ runs, prefix }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderAreaPlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
    });
  }, [dimensions, runs, selectedFlags, svgRef]);

  return plotContainer;
};

export const AreaPlot = ({ data, prefix }: { data: RunPipelineReturn; prefix?: string }) => {
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);
  const decadeFilteredRuns = filterDecadePoints(data.runs);
  const visibleRuns = filterVisibleRuns(decadeFilteredRuns, hiddenFlags, showVetting);

  const allYears = [
    ...new Set(visibleRuns.flatMap((r) => r.orderedPoints.map((p) => p.year))),
  ].sort((a, b) => a - b);
  const interpolatedRuns = visibleRuns.map((run) => interpolatePoints(run, allYears));

  return (
    <PlotStateHandler isError={data.isError} isLoading={data.isLoading} items={interpolatedRuns}>
      {(items) => <AreaBasePlot runs={items} prefix={prefix} />}
    </PlotStateHandler>
  );
};
