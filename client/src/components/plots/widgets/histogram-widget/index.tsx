import { PlotConfig, YEAR_OF_PEAK_WARMING } from "@/lib/config/tabs/variables-config";
import { PlotWidgetHeader, VariableSelect } from "@/components/plots/components";
import { HistogramPlot } from "@/components/plots/plot-variations/histogram";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/utils/data-manipulation/get-meta-points";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";

interface Props {
  plotConfig: PlotConfig;
}

export default function HistogramWidget({ plotConfig }: Props) {
  const [currentVariable, setCurrentVariable] = useState(plotConfig.variables[0]);
  const {
    data: metaIndicators,
    isLoading,
    isError,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      key: currentVariable,
    }),
    select: (data) => getMetaPoints(data),
  });

  const { chartRef, handleDownload } = useDownloadPlotAssets({
    metaIndicators: metaIndicators,
    title: currentVariable.replaceAll("|", " - "),
    subtitle: "",
    imageOptions: {
      padding: { all: 30 },
      includeInFilename: true,
    },
  });

  const getHistogramSplit = () => {
    if (currentVariable === YEAR_OF_PEAK_WARMING) {
      return "decade";
    } else return "default";
  };

  return (
    <div className="h-fit w-full rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader onDownload={handleDownload} title={plotConfig.title} />
      <VariableSelect
        options={plotConfig.variables}
        onChange={setCurrentVariable}
        currentVariable={currentVariable}
      />
      <div ref={chartRef}>
        <HistogramPlot
          split={getHistogramSplit()}
          xUnitText={currentVariable === YEAR_OF_PEAK_WARMING ? "Year" : "°C"}
          data={{
            isLoading,
            isError,
            metaIndicators,
          }}
        />
      </div>
    </div>
  );
}
