"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  getMetaPoints,
  RowFilterProps,
} from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

const tooltipInfo =
  "Climate refers to the long-term patterns of temperature, humidity, wind, and precipitation in a given area. In this context, it is used to categorize scenarios based on their climate impact or assessment.";

const useGetClimateOptions = () => {
  const { data } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      // @ts-expect-error Not sufficient ts support
      key_like: "Climate Assessment|Category [Name]",
    }),
    select: (data) => {
      const metaPoints = getMetaPoints(data);
      return [...new Set(metaPoints?.map((obj) => obj.value))].sort();
    },
  });

  return data ?? [];
};

export const ClimateFilter = () => {
  const uniqueValues = useGetClimateOptions();
  const { climate, setClimate } = useScenarioDashboardUrlParams();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="climate" className="leading-6 font-bold">
          Climate
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select value={climate || ""} onValueChange={setClimate}>
        <SelectTrigger size="lg" className="w-full" id="climate" theme="light">
          {climate || "Select option"}
        </SelectTrigger>
        <SelectContent>
          {uniqueValues.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const ClimateFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const uniqueValues = useGetClimateOptions();
  const { climate, setClimate } = useScenarioDashboardUrlParams(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor="climate" className="w-20 leading-5">
          Climate:
        </Label>
        <Select value={climate || ""} onValueChange={setClimate}>
          <SelectTrigger size="lg" className="h-10 w-fit" id="climate" theme="light">
            {climate || "Select option"}
          </SelectTrigger>
          <SelectContent>
            {uniqueValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          <Trash2Icon size={16} />
        </Button>
      )}
    </div>
  );
};
