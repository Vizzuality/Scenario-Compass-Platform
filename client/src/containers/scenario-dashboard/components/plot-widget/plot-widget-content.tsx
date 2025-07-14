import { ChartType } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import { MetaDataPoint } from "@/components/plots/types/plots";
import LoadingDots from "@/components/animations/loading-dots";
import { LinePlot } from "@/components/plots/line-plot/line-plot";
import { AreaPlot } from "@/components/plots/area-plot/area-plot";

const PlotContent = ({
  chartType,
  dataPoints,
  isLoading,
  isError,
}: {
  chartType: ChartType;
  dataPoints: MetaDataPoint[];
  isLoading: boolean;
  isError: boolean;
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
      {chartType === "line" && <LinePlot dataPoints={dataPoints} />}
      {chartType === "area" && <AreaPlot dataPoints={dataPoints} />}
    </div>
  );
};

export default PlotContent;
