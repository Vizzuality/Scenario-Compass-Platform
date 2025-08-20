"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { renderSingleLinePlot } from "@/components/plots/line-plot/single-line-plot/utils";

interface Props {
  run: ExtendedRun;
}

export const SingleLinePlot: React.FC<Props> = ({ run }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();

  useEffect(() => {
    if (!run || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    renderSingleLinePlot(svg, run);
  }, [run, svgRef]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
