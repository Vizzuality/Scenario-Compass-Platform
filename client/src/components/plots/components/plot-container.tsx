import { ReactNode } from "react";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";

export const PlotContainer = ({ children }: { children: ReactNode }) => {
  const dimensions = getPlotDimensions();
  const aspectRatio = dimensions.WIDTH / dimensions.HEIGHT;

  return (
    <div className="relative flex w-full items-center justify-center" style={{ aspectRatio }}>
      {children}
    </div>
  );
};
