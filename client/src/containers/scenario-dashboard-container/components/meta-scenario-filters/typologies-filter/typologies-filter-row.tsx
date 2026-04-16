import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import {
  FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG,
  MITIGATION_STRATEGY_FILTER_CONFIG,
} from "@/lib/config/filters/typology-filter-config";
import { Checkbox } from "@/components/ui/checkbox";
import { TypologiesFilterFooter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/typologies-filter/typologies-filter-footer";
import { useTypologiesFilter } from "@/hooks/runs/filtering/use-typology-filter";

export const TypologiesFilterRow = ({ prefix }: RowFilterProps) => {
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
  } = useTypologiesFilter(prefix);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="w-24 leading-5">
          Typologies:
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id={id}
              aria-expanded={open}
              className={cn(selectTriggerVariants({ theme: "light", size: "lg" }), "h-10 w-48")}
            >
              {selectedOptions.length === 0
                ? "Select options"
                : selectedOptions.length === 1
                  ? getDisplayLabel(selectedOptions[0])
                  : `${selectedOptions.length} Selected`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="flex flex-col">
              <div className="max-h-[300px] overflow-y-auto p-3">
                <div className="mb-4">
                  <div className="mb-2 text-xs font-semibold text-stone-600">
                    {FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.name}
                  </div>
                  <div className="space-y-2">
                    {FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fossil-fuel-row-${item.value}`}
                          checked={pendingFossilFuelSelectedOptions.includes(item.value)}
                          onCheckedChange={() => toggleValue(item.value, true)}
                        />
                        <label
                          htmlFor={`fossil-fuel-row-${item.value}`}
                          className="cursor-pointer text-sm leading-none font-normal"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2 text-xs font-semibold text-stone-600">
                  {MITIGATION_STRATEGY_FILTER_CONFIG.name}
                </div>
                <div className="space-y-2">
                  {MITIGATION_STRATEGY_FILTER_CONFIG.mappings.map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mitigation-row-${item.value}`}
                        checked={pendingMitigationSelectedOptions.includes(item.value)}
                        onCheckedChange={() => toggleValue(item.value, false)}
                      />
                      <label
                        htmlFor={`mitigation-row-${item.value}`}
                        className="cursor-pointer text-sm leading-none font-normal"
                      >
                        {item.label}
                      </label>
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
    </div>
  );
};
