import { ReactNode } from "react";

export const PlotContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center sm:aspect-[4/3] lg:aspect-[16/10]">
      {children}
    </div>
  );
};
