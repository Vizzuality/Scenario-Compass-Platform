import { useRef } from "react";
import { downloadDivAsPNG } from "@/utils/download-plot-assets-utils/wrapping-title-utils";

export interface DownloadOptions {
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    all?: number;
  };
  includeInFilename?: boolean;
}

const createFilename = (
  baseTitle: string,
  subtitle?: string,
  includeSubtitleInFilename = false,
): string => {
  const sanitizedTitle = baseTitle.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();

  if (includeSubtitleInFilename && subtitle) {
    const sanitizedSubtitle = subtitle.replace(/[^a-zA-Z0-9\s-_]/g, "").replace(/\s+/g, "_");
    return `${sanitizedTitle}_${sanitizedSubtitle}.png`;
  }

  return `${sanitizedTitle}.png`;
};

export const useDownloadPlotImage = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const downloadChart = (title: string, subtitle: string, options: DownloadOptions = {}) => {
    if (!chartRef.current) {
      console.warn("Chart ref not found");
      return;
    }

    const filename = createFilename(title, subtitle, options.includeInFilename);

    downloadDivAsPNG(
      chartRef.current,
      legendRef.current,
      filename,
      title,
      subtitle || undefined,
      options.padding || { all: 30 },
    );
  };

  return {
    chartRef,
    legendRef,
    downloadChart,
  };
};
