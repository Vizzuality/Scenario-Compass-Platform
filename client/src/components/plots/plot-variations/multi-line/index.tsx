"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";
import { renderMultiLinePlot } from "@/components/plots/plot-variations/multi-line/utils";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { PlotStateHandler } from "@/components/plots/components";

interface Props {
  runs: ExtendedRun[];
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

const BasePlot: React.FC<Props> = ({ runs, prefix, onRunClick }) => {
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

interface MultiLinePlotProps {
  data: RunPipelineReturn;
  prefix?: string;
  onRunClick?: (run: ExtendedRun) => void;
}

export const MultiLinePlot: React.FC<MultiLinePlotProps> = ({ data, prefix, onRunClick }) => {
  return (
    <PlotStateHandler data={data}>
      {(runs) => <BasePlot runs={runs} prefix={prefix} onRunClick={onRunClick} />}
    </PlotStateHandler>
  );
};
