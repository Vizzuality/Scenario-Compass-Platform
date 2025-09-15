import { useDownloadPlotImage } from "@/hooks/plots/download/use-download-plot-image";
import { downloadPlotCsv } from "@/hooks/plots/download/csv-utils";
import { DOWNLOAD_TYPE } from "@/components/plots/components/download-plot-button";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface UsePlotDownloadOptions {
  runs: ExtendedRun[] | null;
  title: string;
  imageOptions?: {
    padding?: { all: number };
    includeInFilename?: boolean;
  };
  csvOptions?: {
    delimiter?: string;
    format?: "long" | "wide";
  };
}

export function usePlotDownload({
  runs,
  title,
  imageOptions = { padding: { all: 30 }, includeInFilename: true },
  csvOptions,
}: UsePlotDownloadOptions) {
  const { chartRef, legendRef, downloadChart } = useDownloadPlotImage();

  const handleDownload = (selectedTypes: DOWNLOAD_TYPE[]) => {
    if (!title) return;

    selectedTypes.forEach((type) => {
      switch (type) {
        case "csv":
          if (runs) {
            downloadPlotCsv(runs, title, csvOptions);
          }
          break;
        case "png":
          downloadChart(title, undefined, imageOptions);
          break;
        default:
          console.warn(`Unknown download type: ${type}`);
      }
    });
  };

  return {
    chartRef,
    legendRef,
    handleDownload,
    downloadChart,
  };
}
