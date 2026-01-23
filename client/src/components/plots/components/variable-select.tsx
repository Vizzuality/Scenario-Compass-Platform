import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface Props {
  currentVariable: string;
  options: readonly string[];
  onChange: (variable: string) => void;
}

function VariableOption({ option }: { option: string }) {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: docs } = useQuery({
    ...queryKeys.variables.getDocs(option),
    staleTime: 5 * 60 * 1000,
    enabled: shouldFetch,
  });

  const handleTooltipHover = () => {
    if (!docs) {
      setShouldFetch(true);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectItem value={option} onMouseEnter={handleTooltipHover}>
            {option.replaceAll("|", " - ")}
          </SelectItem>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-100">
          <p className="text-sm">{docs || "Loading..."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function VariableSelect({ options, currentVariable, onChange }: Props) {
  const [shouldFetchDocs, setShouldFetchDocs] = useState(false);

  const { data: currentDocs } = useQuery({
    ...queryKeys.variables.getDocs(currentVariable),
    staleTime: 5 * 60 * 1000,
    enabled: shouldFetchDocs,
  });

  return (
    <div className="mb-5 flex items-center gap-2.5">
      <p className="text-xs">Variable</p>
      <Select onValueChange={onChange} value={currentVariable}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                size="sm"
                className="w-fit max-w-4/5"
                onMouseEnter={() => setShouldFetchDocs(true)}
              >
                <SelectValue className="truncate" placeholder="Select variable..." />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-100">
              <p className="text-sm">{currentDocs || "Hover to load documentation"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SelectContent className="max-h-100">
          {options.map((option) => (
            <VariableOption key={option} option={option} />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
