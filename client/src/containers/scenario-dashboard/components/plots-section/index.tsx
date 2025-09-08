import { PlotGrid } from "@/containers/scenario-dashboard/components/plots-section/plot-grid";
import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";
import ClearFilterButton from "@/containers/scenario-dashboard/components/filter-top/clear-filter-button";
import RunsPanel from "@/containers/scenario-dashboard/components/runs-pannel/runs-panel";

export default function ScenarioExplorationPlotsSection() {
  return (
    <>
      <div className="w-full bg-white pt-8">
        <div className="text-foreground container mx-auto flex items-center justify-between">
          <p>Explore the dashboards below, organised by topic and featuring curated variables</p>
          <ClearFilterButton />
        </div>
      </div>
      <TabsSection />
      <div className="container mx-auto flex gap-16 pb-24">
        <PlotGrid />
        <RunsPanel />
      </div>
    </>
  );
}
