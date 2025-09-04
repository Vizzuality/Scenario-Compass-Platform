"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { renderStackedAreaPlot } from "@/components/plots/stacked/area/utils";
import { useSingleRunPipeline } from "@/hooks/runs/pipeline/use-single-run-pipeline";

interface Props {
  runId: number;
}

export const StackedAreaPlot: React.FC<Props> = ({ runId }) => {
  const data1 = useSingleRunPipeline({ runId, variable: "Final Energy|Industry" });
  const data2 = useSingleRunPipeline({ runId, variable: "Final Energy|Transportation" });
  const data3 = useSingleRunPipeline({
    runId,
    variable: "Final Energy|Residential and Commercial",
  });
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    const dataArray = [...data1.runs, ...data2.runs, ...data3.runs];
    if (!dataArray || dataArray.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    renderStackedAreaPlot({
      svg,
      dimensions,
      runs: dataArray,
    });
  }, [data1.runs, data2.runs, data3.runs, dimensions, svgRef]);

  return plotContainer;
};
