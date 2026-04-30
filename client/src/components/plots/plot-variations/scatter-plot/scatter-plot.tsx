"use client";

import React, { useEffect, useEffectEvent } from "react";
import * as d3 from "d3";
import { renderScatterPlot } from "./render-scatter-plot";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { PlotStateHandler } from "@/components/plots/components";
import { FigureOneDataPoint } from "@/hooks/runs/guided-exploration/use-figure-one";

interface ScatterBasePlotProps {
  points: FigureOneDataPoint[];
  onPointClick?: (point: FigureOneDataPoint) => void;
  selectedPoint?: FigureOneDataPoint | null;
  onSelectedPointChange?: (point: FigureOneDataPoint | null) => void;
  xLabel: string;
  yLabel: string;
}

const ScatterBasePlot: React.FC<ScatterBasePlotProps> = ({
  points,
  onPointClick,
  selectedPoint,
  onSelectedPointChange,
  xLabel,
  yLabel,
}) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  const handlePointClick = useEffectEvent((point: FigureOneDataPoint) => {
    onPointClick?.(point);
  });

  const handleSelectedPointChange = useEffectEvent((point: FigureOneDataPoint | null) => {
    onSelectedPointChange?.(point);
  });

  useEffect(() => {
    if (!points.length || !svgRef.current || dimensions.WIDTH === 0) return;

    const svg = d3.select(svgRef.current);

    renderScatterPlot({
      svg,
      points,
      dimensions,
      selectedPoint,
      onPointClick: handlePointClick,
      onSelectedPointChange: handleSelectedPointChange,
      xLabel,
      yLabel,
    });
  }, [dimensions, points, selectedPoint, xLabel, yLabel]);

  return plotContainer;
};

interface ScatterPlotProps {
  points: FigureOneDataPoint[];
  isLoading: boolean;
  isError: boolean;
  onPointClick?: (point: FigureOneDataPoint) => void;
  selectedPoint?: FigureOneDataPoint | null;
  onSelectedPointChange?: (point: FigureOneDataPoint | null) => void;
  xLabel?: string;
  yLabel?: string;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  points,
  isLoading,
  isError,
  onPointClick,
  selectedPoint,
  onSelectedPointChange,
  xLabel = "X",
  yLabel = "Y",
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <PlotStateHandler items={points} isLoading={isLoading} isError={isError}>
          {(items) => (
            <ScatterBasePlot
              points={items}
              onPointClick={onPointClick}
              selectedPoint={selectedPoint}
              onSelectedPointChange={onSelectedPointChange}
              xLabel={xLabel}
              yLabel={yLabel}
            />
          )}
        </PlotStateHandler>
      </div>
    </div>
  );
};
