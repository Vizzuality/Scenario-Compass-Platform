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
  "Energy refers to the sources and types of energy used in scenarios, such as renewable energy, fossil fuels, or nuclear power. This filter allows you to categorize scenarios based on their energy profiles.";

const useGetEnergyOptions = () => {
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

export const EnergyFilter = () => {
  const uniqueValues = useGetEnergyOptions();
  const { energy, setEnergy } = useScenarioDashboardUrlParams();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="energy" className="leading-6 font-bold">
          Energy
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select value={energy || ""} onValueChange={setEnergy}>
        <SelectTrigger size="lg" className="w-full" id="energy" theme="light">
          {energy || "Select option"}
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

export const EnergyFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const uniqueValues = useGetEnergyOptions();
  const { energy, setEnergy } = useScenarioDashboardUrlParams(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor="energy" className="w-20 leading-5">
          Energy:
        </Label>
        <Select value={energy || ""} onValueChange={setEnergy}>
          <SelectTrigger size="lg" className="h-10 w-fit" id="energy" theme="light">
            {energy || "Select option"}
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
