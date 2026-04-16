"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import { TypologiesFilterFooter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/typologies-filter/typologies-filter-footer";
import { useTypologiesFilter } from "@/hooks/runs/filtering/use-typology-filter";
import {
  FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG,
  MITIGATION_STRATEGY_FILTER_CONFIG,
} from "@/lib/config/filters/typology-filter-config";

const tooltipInfo =
  "Typologies classify scenarios by their fossil fuel phase-down behaviour and mitigation strategy, grouping scenarios with similar decarbonisation pathways.";

export const TypologiesFilter = () => {
  const {
    id,
    selectedOptions,
    pendingFossilFuelSelectedOptions,
    pendingMitigationSelectedOptions,
    toggleValue,
    applyChanges,
    clearAll,
    getDisplayLabel,
    open,
    setOpen,
    hasChanges,
  } = useTypologiesFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Typologies
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
              {selectedOptions.length === 0
                ? "Select typology options"
                : selectedOptions.length === 1
                  ? getDisplayLabel(selectedOptions[0])
                  : `${selectedOptions.length} Selected`}
            </p>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="flex flex-col">
            <div className="max-h-[350px] overflow-y-auto p-3">
              <div className="mb-4">
                <div className="mb-4 text-xs text-stone-600">
                  {FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.name}
                </div>
                <div className="space-y-4">
                  {FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings.map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fossil-fuel-${item.value}`}
                        checked={pendingFossilFuelSelectedOptions.includes(item.value)}
                        onCheckedChange={() => toggleValue(item.value, true)}
                      />
                      <Label
                        htmlFor={`fossil-fuel-${item.value}`}
                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4 text-xs text-stone-600">
                {MITIGATION_STRATEGY_FILTER_CONFIG.name}
              </div>
              <div className="space-y-3.5">
                {MITIGATION_STRATEGY_FILTER_CONFIG.mappings.map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mitigation-${item.value}`}
                      checked={pendingMitigationSelectedOptions.includes(item.value)}
                      onCheckedChange={() => toggleValue(item.value, false)}
                    />
                    <Label
                      htmlFor={`mitigation-${item.value}`}
                      className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <TypologiesFilterFooter
            hasChanges={hasChanges}
            applyChanges={applyChanges}
            clearAll={clearAll}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
