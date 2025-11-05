import { useEffect, useRef, useState } from "react";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";

type Dimensions = Pick<PlotDimensions, "HEIGHT" | "WIDTH">;

/**
 * Custom hook that tracks the dimensions of a container element reactively.
 *
 * This hook provides automatic dimension tracking for responsive layouts using the
 * ResizeObserver API. It efficiently monitors container size changes and updates
 * state only when dimensions actually change, preventing unnecessary re-renders.
 *
 * @returns An object containing:
 * - `containerRef`: React ref to attach to the container element you want to measure
 * - `dimensions`: Current dimensions object with WIDTH and HEIGHT properties
 *
 * @remarks
 * **Common Patterns:**
 * - Check for `dimensions.WIDTH > 0` before rendering to avoid 0-sized content
 * - Combine with `useMemo` when doing expensive dimension calculations
 * - Use with CSS `width: 100%; height: 100%` for fully responsive containers
 *
 * @see {@link usePlotContainer} for a higher-level plotting hook using this
 * @see {@link PlotDimensions} for the full dimensions type with margins
 */
export const useContainerDimensions = () => {
  /**
   * Reference to the DOM element being measured.
   * Attach this ref to the element you want to track.
   */
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Current dimensions of the container.
   * Initialized to 0x0 and updated when the container is measured.
   */
  const [dimensions, setDimensions] = useState<Dimensions>({
    WIDTH: 0,
    HEIGHT: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: WIDTH, height: HEIGHT } = entry.contentRect;

        setDimensions((prev) => {
          if (prev.WIDTH === WIDTH && prev.HEIGHT === HEIGHT) return prev;
          return { WIDTH, HEIGHT };
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ WIDTH: rect.width, HEIGHT: rect.height });

    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array - effect runs once on mount - TODO check for better alternatives in newer React versions.

  return { containerRef, dimensions };
};
