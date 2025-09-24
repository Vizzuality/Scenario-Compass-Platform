"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/use-plot-container";
import { PlotStateHandler } from "@/components/plots/components";
import { renderHistogramPlot } from "@/components/plots/plot-variations/histogram/render";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

interface HistogramChartProps {
  metaIndicators: MetaIndicator[];
}

const BasePlot: React.FC<HistogramChartProps> = ({ metaIndicators }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!metaIndicators.length || !svgRef.current || dimensions.WIDTH === 0) return;

    const svg = d3.select(svgRef.current);
    renderHistogramPlot({
      svg,
      dimensions,
      metaIndicators,
    });
  }, [dimensions, metaIndicators, svgRef]);

  return plotContainer;
};

interface HistogramPlotProps {
  data: {
    metaIndicators: MetaIndicator[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
}

export const HistogramPlot: React.FC<HistogramPlotProps> = ({ data }) => {
  return (
    <PlotStateHandler data={data} fieldName="metaIndicators">
      {(metaIndicators) => <BasePlot metaIndicators={metaIndicators} />}
    </PlotStateHandler>
  );
};
