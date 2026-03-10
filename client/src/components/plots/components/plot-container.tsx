import { ReactNode } from "react";

export const PlotContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex [aspect-ratio:1/1] w-full items-center justify-center sm:[aspect-ratio:4/3] lg:[aspect-ratio:16/10] 2xl:[aspect-ratio:2/1]">
      {children}
    </div>
  );
};
