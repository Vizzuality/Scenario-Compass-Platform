import { PlotGrid } from "@/containers/scenario-dashboard/components/plots-section/plot-grid";
import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";
import ClearFilterButton from "@/containers/scenario-dashboard/components/filter-top/clear-filter-button";
import RunsPanel from "@/containers/scenario-dashboard/components/runs-pannel/runs-panel";

export default function ScenarioExplorationPlotsSection() {
  return (
    <>
      <div className="w-full bg-white pt-8">
        <div className="text-foreground container mx-auto flex items-center justify-end">
          <ClearFilterButton />
        </div>
      </div>
      <TabsSection />
      <div className="container mx-auto flex gap-8 pb-24 lg:gap-16">
        <PlotGrid />
        <RunsPanel />
      </div>
    </>
  );
}
