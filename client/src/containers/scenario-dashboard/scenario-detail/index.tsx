import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDetails from "@/containers/scenario-dashboard/scenario-detail/scenario-details";
import ScenarioDetailPlots from "@/containers/scenario-dashboard/scenario-detail/scenario-detail-plots";
import { Suspense } from "react";

export default function ScenarioDetailContainer({ runId }: { runId: string }) {
  const numberRunId = parseInt(runId, 10);
  return (
    <div className="w-full bg-white">
      <Navbar theme="light" sheetTheme="white" />
      <Suspense>
        <ScenarioDetails runId={numberRunId} />
        <ScenarioDetailPlots runId={numberRunId} />
      </Suspense>
    </div>
  );
}
