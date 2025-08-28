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
  "Land refers to the use and management of land resources in scenarios, including aspects like deforestation, urbanization, and agricultural practices. This filter allows you to categorize scenarios based on their land use impact.";

const useGetLandOptions = () => {
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

export const LandFilter = () => {
  const uniqueValues = useGetLandOptions();
  const { land, setLand } = useScenarioDashboardUrlParams();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="land" className="leading-6 font-bold">
          Land
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select value={land || ""} onValueChange={setLand}>
        <SelectTrigger size="lg" className="w-full" id="land" theme="light">
          {land || "Select option"}
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

export const LandFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const uniqueValues = useGetLandOptions();
  const { land, setLand } = useScenarioDashboardUrlParams(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor="land" className="w-20 leading-5">
          Land:
        </Label>
        <Select value={land || ""} onValueChange={setLand}>
          <SelectTrigger size="lg" className="h-10 w-fit" id="land" theme="light">
            {land || "Select option"}
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
