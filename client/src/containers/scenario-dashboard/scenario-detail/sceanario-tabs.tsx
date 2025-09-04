"use client";

import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import { CustomSelectMultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-line/custom-select-multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import { PlotContainer } from "@/containers/scenario-dashboard/components/plot-widget/components/plot-widget-content";
import { StackedBarPlot } from "@/components/plots/stacked/bar";
import { StackedAreaPlot } from "@/components/plots/stacked/area";

export default function ScenarioTabs({ runId }: { runId: number }) {
  const { result, selectedTab } = useSyncVariables({ runId });

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto flex gap-16">
        <div className="container mx-auto my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
          {Array(2)
            .fill(null)
            .map((_, index) => {
              return (
                <div key={index} className="w-full rounded-md bg-white p-4 select-none">
                  <PlotContainer>
                    <div className="absolute inset-0">
                      <StackedBarPlot runId={runId} />
                    </div>
                  </PlotContainer>
                </div>
              );
            })}
          {Array(2)
            .fill(null)
            .map((_, index) => {
              return (
                <div key={index} className="w-full rounded-md bg-white p-4 select-none">
                  <PlotContainer>
                    <div className="absolute inset-0">
                      <StackedAreaPlot runId={runId} />
                    </div>
                  </PlotContainer>
                </div>
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
