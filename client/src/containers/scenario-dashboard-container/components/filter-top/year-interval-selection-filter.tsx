"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YEAR_OPTIONS } from "@/containers/scenario-dashboard-container/url-store";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";

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
}: YearSelectionFilterProps & { testId?: string }) => (
  <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger theme="dark" size="lg" className="text-beige-light w-full" data-testid={testId}>
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
