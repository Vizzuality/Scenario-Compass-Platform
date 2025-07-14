"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { processChartData, renderLinePlot } from "@/components/plots/line-plot/utils";
import { DataPoint } from "@/components/plots/types/plots";
import { getPlotDimensions } from "@/components/plots/utils/chart";

interface Props {
  dataPoints: DataPoint[];
}

export const LinePlot: React.FC<Props> = ({ dataPoints }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();

  useEffect(() => {
    if (!dataPoints.length || !svgRef.current) return;
    const { scenarios, xDomain, yDomain } = processChartData(dataPoints);
    const svg = d3.select(svgRef.current);
    renderLinePlot(svg, scenarios, xDomain, yDomain, dimensions);
  }, [dataPoints, dimensions]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
