import React, { useRef, useMemo } from "react";
import { useContainerDimensions } from "@/hooks/plots/plot-container/use-container-dimensions";
import { getPlotDimensions, PlotDimensions } from "@/lib/config/plots/plots-dimensions";

export const usePlotContainer = (): {
  svgRef: React.RefObject<SVGSVGElement | null>;
  dimensions: PlotDimensions;
  plotContainer: React.JSX.Element;
} => {
  const { containerRef, dimensions } = useContainerDimensions();
  const svgRef = useRef<SVGSVGElement>(null);

  const responsiveDimensions = useMemo(
    () => getPlotDimensions(dimensions.WIDTH, dimensions.HEIGHT),
    [dimensions.WIDTH, dimensions.HEIGHT],
  );

  const plotContainer = useMemo(
    () => (
      <div ref={containerRef} className="relative h-full w-full">
        <svg ref={svgRef} className="absolute inset-0 h-full w-full" />
      </div>
    ),
    [containerRef],
  );

  return { svgRef, dimensions: responsiveDimensions, plotContainer };
};
