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

const getClimateCategory = (climate: string[] | null): string => {
  if (!climate || climate.length === 0) return "";
  const configIndex = climate.findIndex((item) => item === CLIMATE_CATEGORY_FILTER_CONFIG.name);
  if (configIndex !== -1 && configIndex + 1 < climate.length) {
    return climate[configIndex + 1];
  }
  return "";
};

const getYearNetZero = (climate: string[] | null): string => {
  if (!climate || climate.length === 0) return "";
  const configIndex = climate.findIndex((item) => item === YEAR_NET_ZERO_FILTER_CONFIG.name);
  if (configIndex !== -1 && configIndex + 1 < climate.length) {
    return climate[configIndex + 1];
  }
  return "";
};

const getSelectedValues = (climate: string[] | null): { category: string; year: string } => {
  return {
    category: getClimateCategory(climate),
    year: getYearNetZero(climate),
  };
};

const updateClimateArray = (
  currentClimate: string[] | null,
  newValue: string,
  isClimateCategory: boolean,
): string[] => {
  const current = currentClimate || [];
  const configKey = isClimateCategory
    ? CLIMATE_CATEGORY_FILTER_CONFIG.name
    : YEAR_NET_ZERO_FILTER_CONFIG.name;

  const filtered = [];
  for (let i = 0; i < current.length; i++) {
    if (current[i] === configKey) {
      i++;
    } else {
      filtered.push(current[i]);
    }
  }

  return [...filtered, configKey, newValue];
};

export const ClimateFilter = () => {
  const { climate, setClimate } = useScenarioDashboardUrlParams();
  const { category, year } = getSelectedValues(climate);
  const id = useId();

  const handleValueChange = (newValue: string) => {
    const isClimateCategory = CLIMATE_CATEGORY_FILTER_CONFIG.values.includes(newValue);
    const updated = updateClimateArray(climate, newValue, isClimateCategory);
    setClimate(updated);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Climate
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>

      <Select value="" onValueChange={handleValueChange}>
        <SelectTrigger size="lg" className="w-full" id={id} theme="light">
          <SelectValue placeholder="Add climate filter">Add climate filter</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{CLIMATE_CATEGORY_FILTER_CONFIG.name}</SelectLabel>
            {CLIMATE_CATEGORY_FILTER_CONFIG.values
              .filter((value) => value !== category) // Hide already selected
              .map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>{YEAR_NET_ZERO_FILTER_CONFIG.name}</SelectLabel>
            {YEAR_NET_ZERO_FILTER_CONFIG.values
              .filter((value) => value !== year) // Hide already selected
              .map((value) => (
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
  const { category, year } = getSelectedValues(climate);
  const id = useId();

  const handleValueChange = (newValue: string) => {
    const isClimateCategory = CLIMATE_CATEGORY_FILTER_CONFIG.values.includes(newValue);
    const updated = updateClimateArray(climate, newValue, isClimateCategory);
    setClimate(updated);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 leading-5">
          Climate:
        </Label>
        <div className="flex flex-1 flex-col gap-1">
          <Select value="" onValueChange={handleValueChange}>
            <SelectTrigger size="lg" className="h-8 w-full" id={id} theme="light">
              <SelectValue placeholder="Add filter">Add filter</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{CLIMATE_CATEGORY_FILTER_CONFIG.name}</SelectLabel>
                {CLIMATE_CATEGORY_FILTER_CONFIG.values
                  .filter((value) => value !== category)
                  .map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{YEAR_NET_ZERO_FILTER_CONFIG.name}</SelectLabel>
                {YEAR_NET_ZERO_FILTER_CONFIG.values
                  .filter((value) => value !== year)
                  .map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          <Trash2Icon size={16} />
        </Button>
      )}
    </div>
  );
};
