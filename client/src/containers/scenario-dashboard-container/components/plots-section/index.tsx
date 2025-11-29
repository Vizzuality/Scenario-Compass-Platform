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
      <div className="w-full bg-white pt-8">
        <div className="text-foreground container mx-auto flex items-center justify-between">
          <p>Explore the dashboards below, organised by topic and featuring curated variables</p>
          <Suspense fallback={<p className="underline">Clear all filters</p>}>
            <ClearFilterButton />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<TabsSectionSkeleton />}>
        <TabsSection />
      </Suspense>
      <div className="container mx-auto flex gap-8 pb-24 lg:gap-16">
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
