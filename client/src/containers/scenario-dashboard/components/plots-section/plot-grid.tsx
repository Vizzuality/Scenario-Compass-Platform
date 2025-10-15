"use client";

import { MultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/components/plots/components/chart-type-toggle";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import CustomTabPlotGrid from "@/containers/scenario-dashboard/components/plots-section/custom-tab-plot-grid";
import HistogramWidget from "@/components/plots/widgets/histogram-widget";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

export function PlotGrid() {
  const { startYear, endYear } = useBaseUrlParams();
  const chartType =
    parseInt(startYear!) === parseInt(endYear!) ? PLOT_TYPE_OPTIONS.DOTS : PLOT_TYPE_OPTIONS.AREA;
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
    <div className="my-8 grid h-fit min-h-[600px] w-full grid-cols-1 grid-rows-2 gap-4 lg:grid-cols-2">
      {selectedTab.explorationPlotConfigArray.map((plotConfig) => {
        return plotConfig.plotType && plotConfig.plotType === PLOT_TYPE_OPTIONS.HISTOGRAM ? (
          <HistogramWidget plotConfig={plotConfig} key={plotConfig.title} />
        ) : (
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
