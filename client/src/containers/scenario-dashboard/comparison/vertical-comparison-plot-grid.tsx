import { TabConfig } from "@/lib/config/tabs/tabs-config";
import CustomTabPlotGrid from "@/containers/scenario-dashboard/components/plots-section/custom-tab-plot-grid";
import { PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import HistogramWidget from "@/components/plots/widgets/histogram-widget";
import { MultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/multiple-runs-plot-widget";

export const VerticalComparisonPlotGrid = ({
  selectedTab,
  prefix,
}: {
  selectedTab: TabConfig;
  prefix: string;
}) => {
  if (selectedTab.isCustom)
    return (
      <CustomTabPlotGrid
        prefix={prefix}
        className="flex h-fit w-full flex-col gap-4 pt-6 pr-4"
        initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
      />
    );

  return (
    <>
      {selectedTab.explorationPlotConfigArray.map((plotConfig) => {
        return plotConfig.plotType && plotConfig.plotType === PLOT_TYPE_OPTIONS.HISTOGRAM ? (
          <HistogramWidget plotConfig={plotConfig} key={plotConfig.title} />
        ) : (
          <MultipleRunsPlotWidget
            plotConfig={plotConfig}
            key={plotConfig.title}
            prefix={prefix}
            initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
          />
        );
      })}
    </>
  );
};
