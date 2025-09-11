import LoadingDots from "@/components/animations/loading-dots";
import { ExtendedRun, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { PlotContainer } from "@/components/plots/components/plot-container";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";

interface Props {
  data: RunPipelineReturn;
  children: (runs: ExtendedRun[]) => React.ReactNode;
}

export const PlotStateHandler = ({ data, children }: Props) => {
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
        <div className="-mt-10 px-4 text-center">
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

  return (
    <PlotContainer>
      <div className="absolute inset-0">{children(data.runs)}</div>
    </PlotContainer>
  );
};
