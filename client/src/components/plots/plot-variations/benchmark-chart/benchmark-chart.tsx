"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { FigureThreeData } from "@/hooks/guided-exploration/figure-three/use-figure-three";
import {
  BenchmarkDotTooltipPoint,
  BenchmarkSelectedPoint,
  renderBenchmarkChart,
} from "./render-benchmark-chart";

interface BenchmarkChartProps {
  data: FigureThreeData;
  selectedYears: number[];
  showGroupA: boolean;
  showGroupB: boolean;
  showRangeBars: boolean;
  showNoConcernDots: boolean;
  includeUnvetted: boolean;
  selectedPoint?: BenchmarkSelectedPoint | null;
  onPointClick?: (point: BenchmarkDotTooltipPoint) => void;
  onSelectedPointChange?: (point: BenchmarkDotTooltipPoint | null) => void;
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  data,
  selectedYears,
  showGroupA,
  showGroupB,
  showRangeBars,
  showNoConcernDots,
  includeUnvetted,
  selectedPoint,
  onPointClick,
  onSelectedPointChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const svgEl = svgRef.current;

    if (!containerEl || !svgEl) return;

    const render = () => {
      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;

      if (width <= 0 || height <= 0) return;

      const svg = d3.select(svgEl);
      svg.attr("width", width).attr("height", height);

      renderBenchmarkChart({
        svg,
        data,
        width,
        height,
        selectedYears,
        showGroupA,
        showGroupB,
        showRangeBars,
        showNoConcernDots,
        includeUnvetted,
        selectedPoint,
        onPointClick,
        onSelectedPointChange,
      });
    };

    render();

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(containerEl);

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    data,
    selectedYears,
    showGroupA,
    showGroupB,
    showRangeBars,
    showNoConcernDots,
    includeUnvetted,
    selectedPoint,
    onPointClick,
    onSelectedPointChange,
  ]);

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
};
