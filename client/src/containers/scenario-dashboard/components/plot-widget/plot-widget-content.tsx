import { ChartType } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import LoadingDots from "@/components/animations/loading-dots";
import { LinePlot } from "@/components/plots/line-plot/line-plot";
import { AreaPlot } from "@/components/plots/area-plot/area-plot";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";

const PlotContent = ({
  chartType,
  runs,
  isLoading,
  isError,
  prefix = "",
}: {
  chartType: ChartType;
  runs: ExtendedRun[];
  isLoading: boolean;
  isError: boolean;
  prefix?: string;
}) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div>Error loading data</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {chartType === "line" && <LinePlot runs={runs} prefix={prefix} />}
      {chartType === "area" && <AreaPlot runs={runs} />}
    </div>
  );
};

export default PlotContent;
