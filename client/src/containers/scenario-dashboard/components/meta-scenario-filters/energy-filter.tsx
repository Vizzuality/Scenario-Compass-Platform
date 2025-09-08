"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowFilterProps } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";
import { useId } from "react";

const tooltipInfo =
  "Energy refers to the sources and types of energy used in scenarios, such as renewable energy, fossil fuels, or nuclear power. This filter allows you to categorize scenarios based on their energy profiles.";

export const EnergyFilter = () => {
  const id = useId();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Energy
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select disabled value="" onValueChange={() => {}}>
        <SelectTrigger size="lg" className="w-full" id={id} theme="light">
          <SelectValue placeholder="Select option">Select option</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{CLIMATE_CATEGORY_FILTER_CONFIG.name}</SelectLabel>
            {CLIMATE_CATEGORY_FILTER_CONFIG.values.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>{YEAR_NET_ZERO_FILTER_CONFIG.name}</SelectLabel>
            {YEAR_NET_ZERO_FILTER_CONFIG.values.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const EnergyFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const {} = useScenarioDashboardUrlParams(prefix);
  const id = useId();

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 leading-5">
          Energy:
        </Label>
        <Select disabled value="" onValueChange={() => {}}>
          <SelectTrigger size="lg" className="h-10 w-fit" id={id} theme="light">
            <SelectValue placeholder="Select option">Select option</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{CLIMATE_CATEGORY_FILTER_CONFIG.name}</SelectLabel>
              {CLIMATE_CATEGORY_FILTER_CONFIG.values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
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
