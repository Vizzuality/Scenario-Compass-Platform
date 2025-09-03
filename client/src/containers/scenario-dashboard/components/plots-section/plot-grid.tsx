"use client";

import { MultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-line/multiple-runs-plot-widget";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { CustomSelectMultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-line/custom-select-multiple-runs-plot-widget";

export function PlotGrid() {
  const { year } = useScenarioDashboardUrlParams();
  const chartType = year ? PLOT_TYPE_OPTIONS.DOTS : PLOT_TYPE_OPTIONS.AREA;
  const { selectedTab } = useTabAndVariablesParams();

  return (
    <div className="my-8 grid h-fit min-h-[600px] w-full grid-cols-2 grid-rows-2 gap-4">
      {!selectedTab.isCustom &&
        selectedTab.explorationPlotConfigArray.map((plotConfig) => {
          return (
            <MultipleRunsPlotWidget
              plotConfig={plotConfig}
              key={plotConfig.title}
              initialChartType={chartType}
            />
          );
        })}
      {selectedTab.isCustom &&
        Array(4)
          .fill(null)
          .map((_, index) => (
            <CustomSelectMultipleRunsPlotWidget
              key={index}
              index={index}
              initialChartType={chartType}
            />
          ))}
    </div>
  );
}
