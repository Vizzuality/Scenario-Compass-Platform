"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { renderDotPlot } from "@/components/plots/dot-plot/utils";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";

interface DotPlotProps {
  runs: ExtendedRun[];
  prefix?: string;
}

export const DotPlot: React.FC<DotPlotProps> = ({ runs, prefix }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags, hiddenFlags } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderDotPlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
      hiddenFlags,
    });
  }, [dimensions, hiddenFlags, runs, selectedFlags, svgRef]);

  return plotContainer;
};
