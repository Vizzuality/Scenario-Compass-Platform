"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { renderMultiLinePlot } from "@/components/plots/line-plot/multi-line-plot/utils";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";

interface Props {
  runs: ExtendedRun[];
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

export const MultiLinePlot: React.FC<Props> = ({ runs, prefix, onRunClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = getPlotDimensions();
  const { selectedFlags, hiddenFlags } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    renderMultiLinePlot(svg, runs, selectedFlags, hiddenFlags, onRunClick);
  }, [runs, selectedFlags, hiddenFlags, onRunClick]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.WIDTH} ${dimensions.HEIGHT}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
