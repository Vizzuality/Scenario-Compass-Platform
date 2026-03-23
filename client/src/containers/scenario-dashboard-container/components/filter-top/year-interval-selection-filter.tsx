"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger, DrawerItem } from "@/components/ui/drawer";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { YEAR_OPTIONS } from "@/containers/scenario-dashboard-container/url-store";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";

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

type FilterType = "start" | "end";

interface YearSelectionFilterProps {
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  options?: number[];
}

const SingleYearSelect = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  options = YEAR_OPTIONS,
  testId,
}: YearSelectionFilterProps & { testId?: string }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          theme="dark"
          size="lg"
          className="text-beige-light w-full"
          data-testid={testId}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            selectTriggerVariants({ theme: "dark", size: "lg" }),
            "text-beige-light w-full",
            disabled && "cursor-not-allowed opacity-50",
          )}
          data-testid={testId}
        >
          {value ? (
            <span className="line-clamp-1 flex items-center gap-2">{value}</span>
          ) : (
            <span className="text-primary-foreground line-clamp-1 flex items-center gap-2">
              {placeholder}
            </span>
          )}
          <ChevronDownIcon
            className={cn(
              "size-4 opacity-50 transition-transform duration-200",
              open && "rotate-180", // Rotates the arrow up when drawer is open
            )}
          />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-2 flex max-h-[50vh] flex-col overflow-y-auto p-2 pb-8">
          {options.map((year) => {
            const isSelected = value === year.toString();
            return (
              <DrawerItem
                key={year}
                isSelected={isSelected}
                onClick={() => {
                  onChange(year.toString());
                  setOpen(false);
                }}
              >
                {year}
              </DrawerItem>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default function YearIntervalSelectionFilter() {
  const { startYear, endYear, setStartYear, setEndYear } = useBaseUrlParams();

  const getFilteredYears = (filterType: FilterType) => {
    if (filterType === "end" && startYear) {
      return YEAR_OPTIONS.filter((year) => year >= parseInt(startYear));
    }
    if (filterType === "start" && endYear && startYear) {
      return YEAR_OPTIONS.filter((year) => year <= parseInt(endYear));
    }
    return YEAR_OPTIONS;
  };

  return (
    <div className="flex flex-1 gap-6" data-testid="year-filter">
      <div className="flex w-full flex-col gap-2">
        <Label
          className="text-beige-light text-base leading-6 font-bold"
          id="year-selection-label"
          data-testid="year-selection-label"
        >
          Start year
        </Label>
        <SingleYearSelect
          value={startYear}
          onChange={setStartYear}
          placeholder="Start Year"
          options={getFilteredYears("start")}
          testId="start-year-select"
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label
          className="text-beige-light text-base leading-6 font-bold"
          id="year-selection-label"
          data-testid="year-selection-label"
        >
          End year
        </Label>
        <SingleYearSelect
          value={endYear}
          onChange={setEndYear}
          placeholder="End Year"
          disabled={!startYear}
          options={getFilteredYears("end")}
          testId="end-year-select"
        />
      </div>
    </div>
  );
}
