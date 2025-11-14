import { useDownloadPlotImage } from "@/hooks/plots/download/use-download-plot-image";
import {
  downloadMetaIndicatorCsv,
  downloadPlotCsv,
} from "@/utils/download-plot-assets-utils/csv-utils";
import { DOWNLOAD_TYPE } from "@/components/plots/components/download-plot-button";
import { ExtendedRun } from "@/types/data/run";
import { RefObject } from "react";
import { MetaIndicator } from "@/types/data/meta-indicator";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";

export interface SubtitleData {
  startYear: string | null;
  endYear: string | null;
  geographyName?: string;
}

interface UsePlotDownloadOptions {
  runs?: ExtendedRun[] | null;
  metaIndicators?: MetaIndicator[] | null;
  title: string;
  subtitle?: string | null;
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
}

const createSubtitle = (data?: SubtitleData): string => {
  const parts = [];

  const yearStart = data?.startYear;
  const yearEnd = data?.endYear;
  const geoName = data?.geographyName;

  if (!data?.geographyName || !data.endYear || !data.startYear) {
    return "";
  }

  if (yearStart && yearEnd) {
    parts.push(`${yearStart} - ${yearEnd}`);
  }

  if (geoName) {
    parts.push(geoName);
  }

  return parts.join(" • ");
};

export function useDownloadPlotAssets({
  runs,
  metaIndicators,
  title,
  subtitle,
  imageOptions = { padding: { all: 30 }, includeInFilename: true },
  csvOptions,
}: UsePlotDownloadOptions): UsePlotDownloadReturn {
  const { chartRef, legendRef, downloadChart } = useDownloadPlotImage();
  const { endYear, startYear, geography } = useBaseUrlParams();
  const geographyName = geographyConfig.find((option) => option.id === geography)?.name;

  const finalSubtitle =
    subtitle != null
      ? subtitle
      : createSubtitle({
          endYear,
          startYear,
          geographyName,
        });

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
          downloadChart(title, finalSubtitle, imageOptions);
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
  };
}
