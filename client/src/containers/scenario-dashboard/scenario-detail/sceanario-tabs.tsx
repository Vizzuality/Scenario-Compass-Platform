"use client";

import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { SingleRunPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/single-run-plot-widget";
import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import useSyncRunsPipeline from "@/hooks/runs/pipeline/use-sync-runs-pipeline";

export default function ScenarioTabs({ runId }: { runId: number }) {
  const { selectedTab } = useTabAndVariablesParams();
  const result = useSyncRunsPipeline({ runId });

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto flex gap-16">
        <div className="container mx-auto my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
          {!selectedTab.isCustom &&
            selectedTab.singleRunViewPlotConfigArray.map((plotConfig) => {
              return (
                <SingleRunPlotWidget plotConfig={plotConfig} key={plotConfig.title} runId={runId} />
              );
            })}
        </div>
        <SingleRunScenarioFlags result={result} />
      </div>
    </div>
  );
}
