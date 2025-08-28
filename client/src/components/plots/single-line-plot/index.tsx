"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { renderSingleLinePlot } from "@/components/plots/single-line-plot/utils";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface Props {
  run: ExtendedRun;
}

export const SingleLinePlot: React.FC<Props> = ({ run }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!run || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    renderSingleLinePlot({
      svg,
      dimensions,
      run,
    });
  }, [dimensions, run, svgRef]);

  return plotContainer;
};
