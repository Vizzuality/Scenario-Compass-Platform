import LoadingDots from "@/components/animations/loading-dots";
import { MultiLinePlot } from "@/components/plots/multi-line-plot";
import { AreaPlot } from "@/components/plots/area-plot";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { ReactNode } from "react";
import {
  ChartType,
  PLOT_TYPE_OPTIONS,
} from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { SingleLinePlot } from "@/components/plots/single-line-plot";
import { DotPlot } from "@/components/plots/dot-plot";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import notFoundImage from "@/assets/images/not-found.webp";
import Image from "next/image";

interface Props {
  chartType: ChartType;
  data: RunPipelineReturn;
  onRunClick?: (run: ExtendedRun) => void;
  prefix?: string;
}

const PlotContainer = ({ children }: { children: ReactNode }) => {
  const dimensions = getPlotDimensions();
  const aspectRatio = dimensions.WIDTH / dimensions.HEIGHT;

  return (
    <div className={"relative flex w-full items-center justify-center"} style={{ aspectRatio }}>
      {children}
    </div>
  );
};

const PlotContent = ({ chartType, data, prefix = "", onRunClick }: Props) => {
  if (data.isLoading) {
    return (
      <PlotContainer>
        <LoadingDots />
      </PlotContainer>
    );
  }

  if (data.isError) {
    return (
      <PlotContainer>
        <DataFetchError />
      </PlotContainer>
    );
  }

  if (data.runs.length === 0) {
    return (
      <PlotContainer>
        <div className="text-center">
          <Image
            src={notFoundImage}
            alt="No results"
            width={160}
            height={128}
            className="mx-auto"
          />
          <p className="font-bold">No results available</p>
          <p className="leading-5 text-stone-600">
            There are no runs available for the selected combination of parameters. Try adjusting
            the filters to see results.
          </p>
        </div>
      </PlotContainer>
    );
  }

  const plots = {
    [PLOT_TYPE_OPTIONS.MULTIPLE_LINE]: (
      <MultiLinePlot runs={data.runs} prefix={prefix} onRunClick={onRunClick} />
    ),
    [PLOT_TYPE_OPTIONS.SINGLE_LINE]: <SingleLinePlot run={data.runs[0]} />,
    [PLOT_TYPE_OPTIONS.AREA]: <AreaPlot runs={data.runs} />,
    [PLOT_TYPE_OPTIONS.DOTS]: <DotPlot runs={data.runs} />,
  };

  return (
    <PlotContainer>
      <div className="absolute inset-0">{plots[chartType]}</div>
    </PlotContainer>
  );
};

export default PlotContent;
