import { useEffect, useRef, useState } from "react";
import { PlotDimensions } from "@/components/plots/utils/dimensions";

type Dimensions = Pick<PlotDimensions, "HEIGHT" | "WIDTH">;

export const useContainerDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  }, []);

  return { containerRef, dimensions };
};
