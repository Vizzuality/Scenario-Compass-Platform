"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { renderLinePlot } from "@/components/plots/line-plot/utils";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/chart";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";

interface Props {
  runs: ExtendedRun[];
}

export const LinePlot: React.FC<Props> = ({ runs }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();
  const { selectedFlags, hiddenFlags } = useScenarioFlagsSelection();

  useEffect(() => {
    if (!runs.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    renderLinePlot(svg, runs, selectedFlags, hiddenFlags);
  }, [runs, selectedFlags, hiddenFlags]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
