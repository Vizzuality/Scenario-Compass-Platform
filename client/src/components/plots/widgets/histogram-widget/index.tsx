import { PlotConfig, YEAR_OF_PEAK_WARMING } from "@/lib/config/tabs/variables-config";
import { PlotWidgetHeader, VariableSelect } from "@/components/plots/components";
import { HistogramPlot } from "@/components/plots/plot-variations/histogram";
import { useState } from "react";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { MetaIndicator } from "@/types/data/meta-indicator";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";

interface Props {
  plotConfig: PlotConfig;
  plotConfigArray: readonly PlotConfig[];
  prefix?: string;
}

export default function HistogramWidget({ plotConfig, prefix, plotConfigArray }: Props) {
  const [currentVariable, setCurrentVariable] = useState(plotConfig.variables[0]);
  const { getVariable } = useTabAndVariablesParams(prefix);
  const allVars = plotConfigArray.map((pc) => getVariable(pc));
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection(prefix);

  const variablesNames = allVars.filter((variable) => variable !== currentVariable);

  const { runs, isError, isLoading } = useCombineRunsForVariablesPipeline({
    variablesNames,
    prefix,
  });

  const visibleRuns = filterVisibleRuns(runs, hiddenFlags, showVetting);
  const uniqueRuns = [...new Map(visibleRuns.map((run) => [run.runId, run])).values()];

  const metaIndicators: MetaIndicator[] = uniqueRuns.flatMap((run) => {
    const metaIndicator = run.metaIndicators.find(
      (metaIndicator) => metaIndicator.key == currentVariable,
    );

    if (metaIndicator?.key && metaIndicator?.value) {
      return [{ runId: run.runId, value: metaIndicator.value, key: metaIndicator.key }];
    }
    return [];
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
