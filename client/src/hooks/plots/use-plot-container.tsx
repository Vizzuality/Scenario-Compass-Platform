import React, { useRef, useMemo } from "react";
import { useContainerDimensions } from "@/hooks/plots/use-container-dimensions";
import { getPlotDimensions, PlotDimensions } from "@/components/plots/utils/dimensions";

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
      <div ref={containerRef} className="h-full w-full" style={{ position: "relative" }}>
        <svg ref={svgRef} width={dimensions.WIDTH} height={dimensions.HEIGHT} />
      </div>
    ),
    [containerRef, dimensions.WIDTH, dimensions.HEIGHT],
  );

  return {
    svgRef,
    dimensions: responsiveDimensions,
    plotContainer,
  };
};
