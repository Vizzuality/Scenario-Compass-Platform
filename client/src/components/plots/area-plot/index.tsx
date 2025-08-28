"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderAreaPlot } from "@/components/plots/area-plot/utils";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface AreaChartProps {
  runs: ExtendedRun[];
}

export const AreaPlot: React.FC<AreaChartProps> = ({ runs }) => {
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
