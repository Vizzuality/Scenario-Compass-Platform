import React, { useRef, useMemo } from "react";
import { useContainerDimensions } from "@/hooks/plots/plot-container/use-container-dimensions";
import { getPlotDimensions, PlotDimensions } from "@/lib/config/plots/plots-dimensions";

/**
 * Custom hook that provides a complete plotting container setup with responsive dimensions.
 * WARNING - This approach might need to be revised since it proves ineffective on responsive tests.
 *
 * This hook manages the lifecycle of a plot container, including:
 * - Automatic dimension tracking and responsiveness
 * - SVG element reference management
 * - Pre-configured container structure with proper styling
 * - Memoized plot dimensions for performance optimization
 *
 * @remarks
 * - The container automatically tracks size changes using ResizeObserver
 * - Dimensions are memoized to prevent unnecessary re-renders
 * - The SVG element is positioned relative to its container
 * - Initial dimensions may be 0x0 until the container is mounted and measured
 * - Works well with CSS flexbox/grid layouts that define parent container size
 *
 * @see {@link useContainerDimensions} for the underlying dimension tracking
 * @see {@link getPlotDimensions} for dimension calculation logic
 */
export const usePlotContainer = (): {
  /** Reference to the SVG element for direct DOM manipulation (e.g., D3 selections) */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** Calculated plot dimensions including margins and inner plotting area */
  dimensions: PlotDimensions;
  /** Pre-configured plot container JSX element ready to render */
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
