"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";
import { ClimateFilterFooter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/climate-filter/climate-filter-footer";
import { useClimateFilter } from "@/hooks/runs/filtering/use-climate-filter";

const tooltipInfo =
  "Climate refers to the long-term patterns of temperature, humidity, wind, and precipitation in a given area. In this context, it is used to categorize scenarios based on their climate impact or assessment.";

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export const ClimateFilter = () => {
  const {
    id,
    selectedOptions,
    pendingNetZeroSelectedOptions,
    pendingCategorySelectedOptions,
    toggleValue,
    applyChanges,
    clearAll,
    getDisplayLabel,
    open,
    setOpen,
    hasChanges,
  } = useClimateFilter();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerLabel =
    selectedOptions.length === 0
      ? "Select climate options"
      : selectedOptions.length === 1
        ? getDisplayLabel(selectedOptions[0])
        : `${selectedOptions.length} Selected`;

  // Extracted content to share between Popover and Drawer
  const FilterContent = ({ listClassName = "max-h-[350px]" }: { listClassName?: string }) => (
    <div className="flex flex-col">
      <div className={cn("overflow-y-auto p-3", listClassName)}>
        <div className="mb-4">
          <div className="mb-4 text-xs text-stone-600">{CLIMATE_CATEGORY_FILTER_CONFIG.name}</div>
          <div className="space-y-4">
            {CLIMATE_CATEGORY_FILTER_CONFIG.mappings.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`climate-${item.value}`}
                  checked={pendingCategorySelectedOptions.includes(item.value)}
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
                checked={pendingNetZeroSelectedOptions.includes(item.value)}
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
      <ClimateFilterFooter
        hasChanges={hasChanges}
        applyChanges={applyChanges}
        clearAll={clearAll}
      />
    </div>
  );

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Climate
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>

      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-13 w-full justify-between rounded-[4px] border border-stone-300 font-normal"
            >
              <p className="truncate text-sm">{triggerLabel}</p>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <FilterContent />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-13 w-full justify-between rounded-[4px] border border-stone-300 font-normal"
            >
              <p className="truncate text-sm">{triggerLabel}</p>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 p-0 pb-8">
              <FilterContent listClassName="max-h-[60vh]" />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
