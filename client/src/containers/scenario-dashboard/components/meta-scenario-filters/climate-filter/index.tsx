"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";
import { ClimateFilterFooter } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter/climate-filter-footer";
import { useClimateFilter } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter/use-climate-filter";

const tooltipInfo =
  "Climate refers to the long-term patterns of temperature, humidity, wind, and precipitation in a given area. In this context, it is used to categorize scenarios based on their climate impact or assessment.";

export const ClimateFilter = () => {
  const {
    id,
    allSelected,
    pendingCategory,
    pendingNetZero,
    toggleValue,
    applyChanges,
    clearAll,
    getDisplayLabel,
    open,
    setOpen,
  } = useClimateFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Filter by climate assessment
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-13 w-full justify-between rounded-[4px] border-1 border-stone-300 font-normal"
          >
            <p className="truncate text-sm">
              {allSelected.length === 0
                ? "Select climate options"
                : allSelected.length === 1
                  ? getDisplayLabel(allSelected[0])
                  : `${allSelected.length} Selected`}
            </p>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="flex flex-col">
            <div className="max-h-[350px] overflow-y-auto p-3">
              <div className="mb-4">
                <div className="mb-4 text-xs text-stone-600">
                  {CLIMATE_CATEGORY_FILTER_CONFIG.name}
                </div>
                <div className="space-y-4">
                  {CLIMATE_CATEGORY_FILTER_CONFIG.mappings.map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`climate-${item.value}`}
                        checked={pendingCategory.includes(item.value)}
                        onCheckedChange={() => toggleValue(item.value, true)}
                      />
                      <Label
                        htmlFor={`climate-${item.value}`}
                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4 text-xs text-stone-600">{YEAR_NET_ZERO_FILTER_CONFIG.name}</div>
              <div className="space-y-3.5">
                {YEAR_NET_ZERO_FILTER_CONFIG.mappings.map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`netzero-${item.value}`}
                      checked={pendingNetZero.includes(item.value)}
                      onCheckedChange={() => toggleValue(item.value, false)}
                    />
                    <Label
                      htmlFor={`netzero-${item.value}`}
                      className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ClimateFilterFooter applyChanges={applyChanges} clearAll={clearAll} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
