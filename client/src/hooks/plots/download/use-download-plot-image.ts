import { useRef } from "react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { downloadDivAsPNG } from "@/hooks/plots/download/image-utils";

interface DownloadOptions {
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    all?: number;
  };
  includeInFilename?: boolean;
}

interface SubtitleData {
  startYear?: number;
  endYear?: number;
  geographyName?: string;
}

export const useDownloadPlotImage = () => {
  const { endYear, startYear, geography } = useScenarioDashboardUrlParams();
  const geographyName = geographyConfig.find((option) => option.value === geography)?.label;

  const chartRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const createSubtitle = (data?: SubtitleData): string => {
    const parts = [];

    const yearStart = data?.startYear ?? startYear;
    const yearEnd = data?.endYear ?? endYear;
    const geoName = data?.geographyName ?? geographyName;

    if (yearStart && yearEnd) {
      parts.push(`${yearStart} - ${yearEnd}`);
    }

    if (geoName) {
      parts.push(geoName);
    }

    return parts.join(" • ");
  };

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

  const downloadChart = (
    title: string,
    subtitleData?: SubtitleData,
    options: DownloadOptions = {},
  ) => {
    if (!chartRef.current) {
      console.warn("Chart ref not found");
      return;
    }

    const subtitle = createSubtitle(subtitleData);
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
    createSubtitle,
    urlParams: {
      startYear,
      endYear,
      geography,
      geographyName,
    },
  };
};
