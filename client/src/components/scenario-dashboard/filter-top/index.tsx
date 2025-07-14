import { Button } from "@/components/ui/button";
import GeographyFilter from "@/components/scenario-dashboard/filter-top/geography-filter";
import YearIntervalSelectionFilter from "@/components/scenario-dashboard/filter-top/year-interval-selection-filter";
import ClearFilterButton from "@/components/scenario-dashboard/filter-top/clear-filter-button";

export default function ScenarioDashboardTopFilter() {
  return (
    <div className="bg-burgundy-dark flex w-full flex-col gap-9 rounded-md px-8 pt-6 pb-5">
      <div className="flex w-full flex-col justify-between gap-6 lg:flex-row">
        <p className="text-background w-full text-start text-lg leading-7">
          Start by selecting a country or region and a year.
        </p>
        <ClearFilterButton />
      </div>
      <div className="grid w-full grid-rows-3 items-end gap-6 lg:grid-cols-3 lg:grid-rows-none">
        <GeographyFilter />
        <YearIntervalSelectionFilter />
        <Button size="lg" className="w-full flex-1 text-base leading-5" variant="tertiary">
          Explore Scenarios
        </Button>
      </div>
    </div>
  );
}
