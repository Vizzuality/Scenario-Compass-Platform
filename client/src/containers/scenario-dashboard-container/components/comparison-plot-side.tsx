"use client";

import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { MultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import HistogramWidget from "@/components/plots/widgets/histogram-widget";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";
import CustomTabPlotGrid from "@/containers/scenario-dashboard-container/components/plots-section/custom-tab-plot-grid";

type ComparisonPlotSideProps = {
  prefix?: string;
  className?: string;
} & (
  | { isCustom: true }
  | {
      isCustom?: false;
      plotConfig: PlotConfig;
      plotConfigArray?: readonly PlotConfig[];
      yExtent?: YExtentPair;
    }
);

export function ComparisonPlotSide(props: ComparisonPlotSideProps) {
  const { prefix, className } = props;

  if (props.isCustom) {
    return (
      <div className={className}>
        <CustomTabPlotGrid
          prefix={prefix}
          className="flex h-fit w-full flex-col gap-4"
          initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
        />
      </div>
    );
  }

  const { plotConfig, plotConfigArray, yExtent } = props;

  return (
    <div className={className}>
      {plotConfig.plotType === PLOT_TYPE_OPTIONS.HISTOGRAM ? (
        <HistogramWidget
          prefix={prefix}
          plotConfig={plotConfig}
          plotConfigArray={plotConfigArray ?? []}
        />
      ) : (
        <MultipleRunsPlotWidget
          prefix={prefix}
          plotConfig={plotConfig}
          initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
          yExtent={yExtent}
        />
      )}
    </div>
  );
}
