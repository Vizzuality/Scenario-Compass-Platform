"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { renderStackedAreaPlot } from "@/components/plots/stacked-area/utils";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface Props {
  runs: ExtendedRun[];
}

export const StackedAreaPlot: React.FC<Props> = ({ runs }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!runs || runs.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    renderStackedAreaPlot({
      svg,
      dimensions,
      runs,
    });
  }, [runs, dimensions, svgRef]);

  return plotContainer;
};
