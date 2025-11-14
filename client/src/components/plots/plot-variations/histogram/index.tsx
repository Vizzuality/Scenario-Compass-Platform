"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { PlotStateHandler } from "@/components/plots/components";
import {
  HistogramDataSplit,
  renderHistogramPlot,
} from "@/components/plots/plot-variations/histogram/render";
import { MetaIndicator } from "@/types/data/meta-indicator";

interface HistogramChartProps {
  metaIndicators: MetaIndicator[];
  split: HistogramDataSplit;
  xUnitText: string;
}

const BasePlot: React.FC<HistogramChartProps> = ({ metaIndicators, split, xUnitText }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!metaIndicators.length || !svgRef.current || dimensions.WIDTH === 0) return;

    const svg = d3.select(svgRef.current);
    renderHistogramPlot({
      svg,
      dimensions,
      metaIndicators,
      split,
      xUnitText,
    });
  }, [dimensions, metaIndicators, split, svgRef, xUnitText]);

  return plotContainer;
};

interface HistogramPlotProps {
  data: {
    metaIndicators: MetaIndicator[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  split: HistogramDataSplit;
  xUnitText: string;
}

export const HistogramPlot: React.FC<HistogramPlotProps> = ({ data, split, xUnitText }) => {
  return (
    <PlotStateHandler data={data} fieldName="metaIndicators">
      {(metaIndicators) => (
        <BasePlot split={split} metaIndicators={metaIndicators} xUnitText={xUnitText} />
      )}
    </PlotStateHandler>
  );
};
