"use client";

import { useMemo } from "react";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { PlotConfig as PlotConfigType } from "@/lib/config/tabs/variables-config";
import { ComparisonPlotSide } from "@/containers/scenario-dashboard-container/components/comparison-plot-side";

interface Props {
  plotConfig: PlotConfig;
  prefix: string;
  plotConfigArray?: readonly PlotConfigType[];
}

export function ComparisonPlotPair({ plotConfig, prefix, plotConfigArray }: Props) {
  const { getVariable } = useTabAndVariablesParams();
  const { getVariable: getPrefixedVariable } = useTabAndVariablesParams(prefix);

  const leftVariable = getVariable(plotConfig);
  const rightVariable = getPrefixedVariable(plotConfig);

  const leftData = useGetMultipleRunsForVariablePipeline({ variable: leftVariable });
  const rightData = useGetMultipleRunsForVariablePipeline({ variable: rightVariable, prefix });

  /**
   * Shared Y Extent calculation stays here because it
   * requires knowledge of BOTH datasets.
   */
  const sharedYExtent = useMemo(() => {
    const allRuns = [...(leftData.runs ?? []), ...(rightData.runs ?? [])];
    if (allRuns.length === 0) return undefined;

    let min = Infinity;
    let max = -Infinity;
    for (const run of allRuns) {
      for (const point of run.orderedPoints) {
        if (point.value < min) min = point.value;
        if (point.value > max) max = point.value;
      }
    }

    return { yMin: min, yMax: max };
  }, [leftData.runs, rightData.runs]);

  return (
    <div className="-my-6 grid grid-cols-2 gap-0">
      <ComparisonPlotSide
        plotConfig={plotConfig}
        plotConfigArray={plotConfigArray}
        yExtent={sharedYExtent}
        className="border-r py-6 pr-4"
      />
      <ComparisonPlotSide
        prefix={prefix}
        plotConfig={plotConfig}
        plotConfigArray={plotConfigArray}
        yExtent={sharedYExtent}
        className="py-6 pl-4"
      />
    </div>
  );
}
