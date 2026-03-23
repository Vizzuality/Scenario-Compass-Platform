import {
  PlotGrid,
  PlotGridSkeleton,
} from "@/containers/scenario-dashboard-container/components/plots-section/plot-grid";
import {
  TabsSection,
  TabsSectionSkeleton,
} from "@/containers/scenario-dashboard-container/components/plots-section/tabs-section";
import ClearFilterButton from "@/containers/scenario-dashboard-container/components/filter-top/clear-filter-button";
import RunsPanel, {
  RunsPanelSkeleton,
} from "@/containers/scenario-dashboard-container/components/runs-pannel/runs-panel";
import { Suspense } from "react";

export default function ScenarioExplorationPlotsSection() {
  return (
    <>
      <div className="w-full bg-white pt-4 md:pt-8">
        <div className="text-foreground container mx-auto flex flex-col items-center justify-between gap-5 px-4 sm:px-0 md:flex-row md:gap-0">
          <p className="order-2 md:order-1">
            Explore the dashboards below, organised by topic and featuring curated variables
          </p>
          <Suspense fallback={<p className="underline">Clear all filters</p>}>
            <ClearFilterButton />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<TabsSectionSkeleton />}>
        <TabsSection />
      </Suspense>
      <div className="container mx-auto flex flex-col gap-8 px-4 pb-24 sm:px-0 md:flex-row lg:gap-16">
        <Suspense fallback={<PlotGridSkeleton />}>
          <PlotGrid />
        </Suspense>
        <Suspense fallback={<RunsPanelSkeleton />}>
          <RunsPanel />
        </Suspense>
      </div>
    </>
  );
}
