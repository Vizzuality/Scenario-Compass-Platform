import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDetails from "@/containers/scenario-dashboard/scenario-detail/scenario-details";
import ScenarioTabs from "@/containers/scenario-dashboard/scenario-detail/sceanario-tabs";
import { Suspense } from "react";
import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";

export default function ScenarioDetailContainer({ runId }: { runId: string }) {
  const numberRunId = parseInt(runId, 10);
  return (
    <div className="w-full bg-white">
      <Navbar theme="light" sheetTheme="white" />
      <Suspense>
        <ScenarioDetails runId={numberRunId} />
        <TabsSection />
        <ScenarioTabs runId={numberRunId} />
      </Suspense>
    </div>
  );
}
