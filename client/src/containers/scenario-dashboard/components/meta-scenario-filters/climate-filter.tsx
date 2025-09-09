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
  "Climate refers to the long-term patterns of temperature, humidity, wind, and precipitation in a given area. In this context, it is used to categorize scenarios based on their climate impact or assessment.";

const getCurrentValue = (climate: string[] | null) => {
  if (!climate || climate.length < 2) return "";
  return climate[1];
};

const getDisplayText = (climate: string[] | null) => {
  if (!climate || climate.length < 2) return "Select option";
  return climate[1];
};

const getKey = (value: string) => {
  const isClimateCategory = CLIMATE_CATEGORY_FILTER_CONFIG.values.includes(value);
  return isClimateCategory ? CLIMATE_CATEGORY_FILTER_CONFIG.name : YEAR_NET_ZERO_FILTER_CONFIG.name;
};

export const ClimateFilter = () => {
  const { climate, setClimate } = useScenarioDashboardUrlParams();
  const value = getCurrentValue(climate);
  const id = useId();

  const handleValueChange = (newValue: string) => {
    const key = getKey(newValue);
    setClimate([key, newValue]);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Climate
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger size="lg" className="w-full" id={id} theme="light">
          <SelectValue placeholder="Select option">{getDisplayText(climate)}</SelectValue>
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

export const ClimateFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const { climate, setClimate } = useScenarioDashboardUrlParams(prefix);
  const value = getCurrentValue(climate);
  const id = useId();

  const handleValueChange = (newValue: string) => {
    const key = getKey(newValue);
    setClimate([key, newValue]);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 leading-5">
          Climate:
        </Label>
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger size="lg" className="h-10 w-fit" id={id} theme="light">
            <SelectValue placeholder="Select option">{getDisplayText(climate)}</SelectValue>
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
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          <Trash2Icon size={16} />
        </Button>
      )}
    </div>
  );
};
