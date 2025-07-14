import { ChartArea, ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChartType = "line" | "area";

interface ChartTypeToggleProps {
  currentType?: ChartType;
  onChange?: (type: ChartType) => void;
}

const selectedClass = "bg-beige-dark text-foreground border-primary";
const unselectedClass = "bg-transparent text-stone-500 border-stone-500";

export const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({
  currentType = "line",
  onChange,
}) => {
  const getButtonClass = (type: ChartType) =>
    currentType === type ? selectedClass : unselectedClass;

  const handleKeyDown = (event: React.KeyboardEvent, type: ChartType) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange?.(type);
    }
  };

  return (
    <div className="flex" role="radiogroup" aria-label="Chart type selection">
      <Button
        variant="ghost"
        role="radio"
        aria-checked={currentType === "area"}
        aria-label="Area chart"
        onClick={() => onChange?.("area")}
        onKeyDown={(e) => handleKeyDown(e, "area")}
        className={cn(
          "rounded-l-[4px] rounded-r-none border border-r-0 p-2",
          getButtonClass("area"),
        )}
      >
        <ChartArea className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        role="radio"
        aria-checked={currentType === "line"}
        aria-label="Line chart"
        onClick={() => onChange?.("line")}
        onKeyDown={(e) => handleKeyDown(e, "line")}
        className={cn(
          "rounded-l-none rounded-r-[4px] border border-l-0 p-2",
          getButtonClass("line"),
        )}
      >
        <ChartLine className="h-4 w-4" />
      </Button>
    </div>
  );
};
