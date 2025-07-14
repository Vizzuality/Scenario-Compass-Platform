"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { processAreaChartData, renderAreaPlot } from "@/components/plots/area-plot/utils";
import { DataPoint } from "@/components/plots/utils/types";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";

interface AreaChartProps {
  dataPoints: DataPoint[];
}

export const AreaPlot: React.FC<AreaChartProps> = ({ dataPoints }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();

  useEffect(() => {
    if (!dataPoints || !svgRef.current) return;
    const { aggregatedData, xDomain, yDomain } = processAreaChartData(dataPoints);
    const svg = d3.select(svgRef.current);
    renderAreaPlot(svg, aggregatedData, xDomain, yDomain, dimensions);
  }, [dataPoints, dimensions]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%" }}
    />
  );
};
