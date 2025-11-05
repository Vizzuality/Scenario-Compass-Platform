import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";
import { useClimateFilter } from "@/hooks/runs/filtering/use-climate-filter";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";
import { Checkbox } from "@/components/ui/checkbox";
import { ClimateFilterFooter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/climate-filter/climate-filter-footer";

export const ClimateFilterRow = ({ prefix }: RowFilterProps) => {
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
  } = useClimateFilter(prefix);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="w-20 leading-5">
          Climate:
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id={id}
              aria-expanded={open}
              className={cn(selectTriggerVariants({ theme: "light", size: "lg" }), "h-10")}
            >
              {allSelected.length === 0
                ? "Select options"
                : allSelected.length === 1
                  ? getDisplayLabel(allSelected[0])
                  : `${allSelected.length} Selected`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="flex flex-col">
              <div className="max-h-[300px] overflow-y-auto p-3">
                <div className="mb-4">
                  <div className="mb-2 text-xs font-semibold text-stone-600">
                    {CLIMATE_CATEGORY_FILTER_CONFIG.name}
                  </div>
                  <div className="space-y-2">
                    {CLIMATE_CATEGORY_FILTER_CONFIG.mappings.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`climate-row-${item.value}`}
                          checked={pendingCategory.includes(item.value)}
                          onCheckedChange={() => toggleValue(item.value, true)}
                        />
                        <label
                          htmlFor={`climate-row-${item.value}`}
                          className="cursor-pointer text-sm leading-none font-normal"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2 text-xs font-semibold text-stone-600">
                  {YEAR_NET_ZERO_FILTER_CONFIG.name}
                </div>
                <div className="space-y-2">
                  {YEAR_NET_ZERO_FILTER_CONFIG.mappings.map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`netzero-row-${item.value}`}
                        checked={pendingNetZero.includes(item.value)}
                        onCheckedChange={() => toggleValue(item.value, false)}
                      />
                      <label
                        htmlFor={`netzero-row-${item.value}`}
                        className="cursor-pointer text-sm leading-none font-normal"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ClimateFilterFooter applyChanges={applyChanges} clearAll={clearAll} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
