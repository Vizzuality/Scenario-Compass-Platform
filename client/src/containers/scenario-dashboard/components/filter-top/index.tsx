import YearIntervalSelectionFilter from "@/containers/scenario-dashboard/components/filter-top/year-interval-selection-filter";
import ClearFilterButton from "@/containers/scenario-dashboard/components/filter-top/clear-filter-button";
import GeographyFilter from "@/containers/scenario-dashboard/components/filter-top/geography-filter";
import ExploreScenariosButton from "@/containers/scenario-dashboard/components/explore-scenarios-button";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function ScenarioDashboardTopFilter() {
  return (
    <div className="bg-burgundy-dark flex w-full flex-col gap-9 rounded-md px-8 pt-6 pb-5">
      <div className="flex w-full flex-col justify-between gap-6 md:flex-row">
        <p className="text-background w-full text-start text-lg leading-7">
          Start by selecting a country or region and a year.
        </p>
        <ClearFilterButton />
      </div>
      <div className="grid w-full grid-rows-3 items-end gap-6 lg:grid-cols-3 lg:grid-rows-none">
        <GeographyFilter />
        <YearIntervalSelectionFilter />
        <ExploreScenariosButton href={INTERNAL_PATHS.SCENARIO_DASHBOARD_EXPLORATION} />
      </div>
    </div>
  );
}
