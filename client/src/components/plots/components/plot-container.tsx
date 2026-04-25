import { ReactNode } from "react";

export const PlotContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex aspect-square min-h-[350px] w-full items-center justify-center sm:aspect-[4/3] lg:aspect-[16/10]">
      {children}
    </div>
  );
};
