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
  const handleToggle = () => {
    const newType = currentType === "line" ? "area" : "line";
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
          getButtonClass("area"),
        )}
        onClick={handleToggle}
      >
        <ChartArea className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "rounded-l-none rounded-r-[4px] border border-l-0 p-2",
          getButtonClass("line"),
        )}
        onClick={handleToggle}
      >
        <ChartLine className="h-4 w-4" />
      </Button>
    </div>
  );
};
