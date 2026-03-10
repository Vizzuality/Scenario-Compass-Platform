import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  onClick: () => void;
}

export function ExpandChartButton({ onClick }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            aria-label="Expand chart"
            className="h-10 w-10"
          >
            <Maximize strokeWidth={1.7} className="!h-5 !w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Maximize this chart</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
