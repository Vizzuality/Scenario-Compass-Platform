"use client";

import { SingleRunPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/single-line/single-run-plot-widget";
import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import { CustomSelectMultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-line/custom-select-multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";

export default function ScenarioTabs({ runId }: { runId: number }) {
  const { result, selectedTab } = useSyncVariables({ runId });

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
          {selectedTab.isCustom &&
            Array(4)
              .fill(null)
              .map((_, index) => (
                <CustomSelectMultipleRunsPlotWidget
                  key={index}
                  index={index}
                  initialChartType={PLOT_TYPE_OPTIONS.SINGLE_LINE}
                />
              ))}
        </div>
        <SingleRunScenarioFlags result={result} />
      </div>
    </div>
  );
}
