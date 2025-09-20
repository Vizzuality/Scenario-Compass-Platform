import {
  DownloadOptions,
  SubtitleData,
  useDownloadPlotImage,
} from "@/hooks/plots/download/use-download-plot-image";
import { downloadMetaIndicatorCsv, downloadPlotCsv } from "@/hooks/plots/download/csv-utils";
import { DOWNLOAD_TYPE } from "@/components/plots/components/download-plot-button";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { RefObject } from "react";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

interface UsePlotDownloadOptions {
  runs?: ExtendedRun[] | null;
  metaIndicators?: MetaIndicator[] | null;
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

interface UsePlotDownloadReturn {
  chartRef: RefObject<HTMLDivElement | null>;
  legendRef: RefObject<HTMLDivElement | null>;
  handleDownload: (selectedTypes: DOWNLOAD_TYPE[]) => void;
  downloadChart: (title: string, subtitleData?: SubtitleData, options?: DownloadOptions) => void;
}

export function usePlotDownload({
  runs,
  metaIndicators,
  title,
  imageOptions = { padding: { all: 30 }, includeInFilename: true },
  csvOptions,
}: UsePlotDownloadOptions): UsePlotDownloadReturn {
  const { chartRef, legendRef, downloadChart } = useDownloadPlotImage();

  const handleDownload = (selectedTypes: DOWNLOAD_TYPE[]) => {
    if (!title) return;

    selectedTypes.forEach((type) => {
      switch (type) {
        case "csv":
          if (runs) {
            downloadPlotCsv(runs, title, csvOptions);
          } else if (metaIndicators) {
            downloadMetaIndicatorCsv(metaIndicators, title, csvOptions);
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
