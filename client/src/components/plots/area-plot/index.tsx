"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { renderAreaPlot } from "@/components/plots/area-plot/utils";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";

interface AreaChartProps {
  runs: ExtendedRun[];
}

export const AreaPlot: React.FC<AreaChartProps> = ({ runs }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();

  useEffect(() => {
    if (!runs.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    renderAreaPlot(svg, runs);
  }, [runs]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%" }}
    />
  );
};
