"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";
import { renderMultiLinePlot } from "@/components/plots/multi-line-plot/utils";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";

interface Props {
  runs: ExtendedRun[];
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

export const MultiLinePlot: React.FC<Props> = ({ runs, prefix, onRunClick }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();
  const { selectedFlags, hiddenFlags } = useScenarioFlagsSelection(prefix);

  useEffect(() => {
    if (!runs.length || !svgRef.current || dimensions.WIDTH === 0) return;
    const svg = d3.select(svgRef.current);
    renderMultiLinePlot({
      svg,
      runs,
      dimensions,
      selectedFlags,
      hiddenFlags,
      onRunClick,
    });
  }, [runs, dimensions, selectedFlags, hiddenFlags, onRunClick, svgRef]);

  return plotContainer;
};
