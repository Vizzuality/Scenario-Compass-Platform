"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { processAreaChartData, renderAreaPlot } from "@/components/plots/area-plot/utils";
import { getPlotDimensions } from "@/components/plots/utils/chart";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";

interface AreaChartProps {
  runs: ExtendedRun[];
}

export const AreaPlot: React.FC<AreaChartProps> = ({ runs }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();

  useEffect(() => {
    if (!runs.length || !svgRef.current) return;
    const { aggregatedData, xDomain, yDomain } = processAreaChartData(runs);
    const svg = d3.select(svgRef.current);
    renderAreaPlot(svg, aggregatedData, xDomain, yDomain, dimensions);
  }, [runs, dimensions]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%" }}
    />
  );
};
