import YearIntervalSelectionFilter from "@/containers/scenario-dashboard/components/filter-top/year-interval-selection-filter";
import GeographyFilter from "@/containers/scenario-dashboard/components/filter-top/geography-filter";
import { Suspense } from "react";

export default function ScenarioDashboardTopFilter({ children }: { children?: React.ReactNode }) {
  return (
    <div className="container mb-10 flex w-full flex-col gap-9 rounded-md pt-6 pb-7">
      <div className="flex w-full flex-col justify-between gap-6 md:flex-row"></div>
      <div className="grid w-full grid-rows-3 items-end gap-6 lg:grid-cols-3 lg:grid-rows-none">
        <Suspense>
          <GeographyFilter />
          <YearIntervalSelectionFilter />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
