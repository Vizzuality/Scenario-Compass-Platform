import LoadingDots from "@/components/animations/loading-dots";
import { MultiLinePlot } from "@/components/plots/line-plot/multi-line-plot";
import { AreaPlot } from "@/components/plots/area-plot";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { ReactNode } from "react";
import {
  ChartType,
  PLOT_TYPE_OPTIONS,
} from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import { SingleLinePlot } from "@/components/plots/line-plot/single-line-plot";

interface Props {
  chartType: ChartType;
  data: RunPipelineReturn;
  onRunClick?: (run: ExtendedRun) => void;
  prefix?: string;
}

const PlotContainer = ({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) => {
  const dimensions = getPlotDimensions();
  const aspectRatio = dimensions.WIDTH / dimensions.HEIGHT;

  return (
    <div
      className={`relative w-full ${centered ? "flex items-center justify-center" : ""}`}
      style={{ aspectRatio }}
    >
      {children}
    </div>
  );
};

const PlotContent = ({ chartType, data, prefix = "", onRunClick }: Props) => {
  if (data.isLoading) {
    return (
      <PlotContainer centered>
        <LoadingDots />
      </PlotContainer>
    );
  }

  if (data.isLoading) {
    return (
      <PlotContainer centered>
        <div>Error loading data</div>
      </PlotContainer>
    );
  }

  const plots = {
    [PLOT_TYPE_OPTIONS.MULTIPLE_LINE]: (
      <MultiLinePlot runs={data.runs} prefix={prefix} onRunClick={onRunClick} />
    ),
    [PLOT_TYPE_OPTIONS.SINGLE_LINE]: <SingleLinePlot run={data.runs[0]} />,
    [PLOT_TYPE_OPTIONS.AREA]: <AreaPlot runs={data.runs} />,
  };

  return (
    <PlotContainer>
      <div className="absolute inset-0">{plots[chartType]}</div>
    </PlotContainer>
  );
};

export default PlotContent;
