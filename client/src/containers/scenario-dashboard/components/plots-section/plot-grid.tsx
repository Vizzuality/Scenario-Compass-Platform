"use client";

import { MultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/multiple-runs-plot-widget";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { PLOT_TYPE_OPTIONS } from "@/components/plots/components/chart-type-toggle";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import CustomTabPlotGrid from "@/containers/scenario-dashboard/components/plots-section/custom-tab-plot-grid";

export function PlotGrid() {
  const { year } = useScenarioDashboardUrlParams();
  const chartType = year ? PLOT_TYPE_OPTIONS.DOTS : PLOT_TYPE_OPTIONS.AREA;
  const { selectedTab } = useTabAndVariablesParams();

  if (selectedTab.isCustom) {
    return (
      <CustomTabPlotGrid
        className="my-8 grid h-fit min-h-[600px] w-full grid-cols-2 grid-rows-2 items-stretch gap-4"
        initialChartType={chartType}
      />
    );
  }

  return (
    <div className="my-8 grid h-fit min-h-[600px] w-full grid-cols-2 grid-rows-2 gap-4">
      {selectedTab.explorationPlotConfigArray.map((plotConfig) => {
        return (
          <MultipleRunsPlotWidget
            plotConfig={plotConfig}
            key={plotConfig.title}
            initialChartType={chartType}
          />
        );
      })}
    </div>
  );
}
