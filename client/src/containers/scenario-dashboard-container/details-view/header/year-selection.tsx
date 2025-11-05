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
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";

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
    <SelectTrigger theme="light" size="lg" className="w-full" data-testid={testId}>
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

export default function YearSelection() {
  const { model, geography, scenario, startYear, endYear, setEndYear, setStartYear } =
    useBaseUrlParams({ useDefaults: false });

  const isStartDisabled = !model || !scenario || !geography;

  const { data } = useQuery({
    ...queryKeys.dataPoints.tabulate({
      model: {
        name: String(model),
      },
      scenario: {
        name: String(scenario),
      },
      region: {
        id: Number(geography),
      },
    }),
    enabled: !!model && !!scenario && !!geography,
    select: (data) => extractDataPoints(data),
  });

  const years = [...new Set(data?.map((dp) => dp.year).sort())];

  const getFilteredYears = (filterType: FilterType) => {
    if (filterType === "end" && startYear) {
      return years.filter((year) => year >= parseInt(startYear));
    }
    if (filterType === "start" && endYear && startYear) {
      return years.filter((year) => year <= parseInt(endYear));
    }
    return years;
  };

  return (
    <div className="flex flex-1 flex-col gap-2" data-testid="year-filter">
      <div className="flex gap-6">
        <Label
          className="text-foreground text-base leading-6 font-bold"
          id="year-selection-label"
          data-testid="year-selection-label"
        >
          Year selection
        </Label>
      </div>

      <div className="flex gap-6" data-testid="year-range-container">
        <SingleYearSelect
          value={startYear ?? null}
          onChange={setStartYear}
          placeholder="Start year"
          options={getFilteredYears("start")}
          testId="start-year-select"
          disabled={isStartDisabled}
        />
        <SingleYearSelect
          value={endYear ?? null}
          onChange={setEndYear}
          placeholder="End year"
          disabled={!startYear}
          options={getFilteredYears("end")}
          testId="end-year-select"
        />
      </div>
    </div>
  );
}
