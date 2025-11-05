import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function TooltipInfo({ info }: { info: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon size={14} />
      </TooltipTrigger>
      <TooltipContent className="max-w-100">
        <p className="text-sm">{info}</p>
      </TooltipContent>
    </Tooltip>
  );
}
