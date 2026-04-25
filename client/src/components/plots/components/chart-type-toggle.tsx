import { ChartArea, ChartLine, BarChart2, BarChartHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";

export const PLOT_TYPE_OPTIONS = {
  MULTIPLE_LINE: "multipleLine",
  SINGLE_LINE: "singleLine",
  AREA: "area",
  DOTS: "dots",
  STACKED_AREA: "stackedArea",
  HISTOGRAM: "histogram",
  WATERFALL: "waterfall",
  STACKED_BAR: "stackedBar",
} as const;

export type ChartType = (typeof PLOT_TYPE_OPTIONS)[keyof typeof PLOT_TYPE_OPTIONS];

interface ChartTypeToggleProps {
  currentType?: ChartType;
  onChange?: (type: ChartType) => void;
  options?: [ChartType, ChartType];
}

const CHART_ICONS: Record<ChartType, React.ReactNode> = {
  multipleLine: <ChartLine className="h-4 w-4" />,
  singleLine: <ChartLine className="h-4 w-4" />,
  area: <ChartArea className="h-4 w-4" />,
  dots: <ChartArea className="h-4 w-4" />,
  stackedArea: <ChartArea className="h-4 w-4" />,
  histogram: <BarChart2 className="h-4 w-4" />,
  waterfall: <BarChart2 className="h-4 w-4" />,
  stackedBar: <BarChartHorizontal className="h-4 w-4" />,
};

const selectedClass = "bg-beige-dark text-foreground border-primary";
const unselectedClass = "bg-transparent text-stone-500 border-stone-500";

export const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({
  currentType,
  onChange,
  options = [PLOT_TYPE_OPTIONS.AREA, PLOT_TYPE_OPTIONS.MULTIPLE_LINE],
}) => {
  const [left, right] = options;

  return (
    <div className="flex">
      <Button
        variant="ghost"
        className={cn(
          "rounded-l-[4px] rounded-r-none border border-r-0 p-2",
          currentType === left ? selectedClass : unselectedClass,
        )}
        onClick={() => onChange?.(left)}
      >
        {CHART_ICONS[left]}
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "rounded-l-none rounded-r-[4px] border border-l-0 p-2",
          currentType === right ? selectedClass : unselectedClass,
        )}
        onClick={() => onChange?.(right)}
      >
        {CHART_ICONS[right]}
      </Button>
    </div>
  );
};
