import { ChartArea, ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const PLOT_TYPE_OPTIONS = {
  MULTIPLE_LINE: "multipleLine",
  SINGLE_LINE: "singleLine",
  AREA: "area",
  DOTS: "dots",
} as const;

export type ChartType = (typeof PLOT_TYPE_OPTIONS)[keyof typeof PLOT_TYPE_OPTIONS];

interface ChartTypeToggleProps {
  currentType?: ChartType;
  onChange?: (type: ChartType) => void;
}

const selectedClass = "bg-beige-dark text-foreground border-primary";
const unselectedClass = "bg-transparent text-stone-500 border-stone-500";

export const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({
  currentType = "multipleLine",
  onChange,
}) => {
  const handleToggle = () => {
    const newType =
      currentType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE
        ? PLOT_TYPE_OPTIONS.AREA
        : PLOT_TYPE_OPTIONS.MULTIPLE_LINE;
    if (onChange) {
      onChange(newType);
    }
  };

  const getButtonClass = (type: ChartType) => {
    return currentType === type ? selectedClass : unselectedClass;
  };

  return (
    <div className="flex">
      <Button
        variant="ghost"
        className={cn(
          "rounded-l-[4px] rounded-r-none border border-r-0 p-2",
          getButtonClass(PLOT_TYPE_OPTIONS.AREA),
        )}
        onClick={handleToggle}
      >
        <ChartArea className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "rounded-l-none rounded-r-[4px] border border-l-0 p-2",
          getButtonClass(PLOT_TYPE_OPTIONS.MULTIPLE_LINE),
        )}
        onClick={handleToggle}
      >
        <ChartLine className="h-4 w-4" />
      </Button>
    </div>
  );
};
