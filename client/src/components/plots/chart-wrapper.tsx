import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export const ChartWrapper = forwardRef<HTMLDivElement, Props>(
  ({ children, className = "" }, ref) => (
    <div ref={ref} className={cn("h-90 w-full 2xl:h-120", className)}>
      {children}
    </div>
  ),
);

ChartWrapper.displayName = "ChartWrapper";
