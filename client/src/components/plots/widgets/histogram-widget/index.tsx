import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { PlotWidgetHeader, VariableSelect } from "@/components/plots/components";
import { HistogramPlot } from "@/components/plots/plot-variations/histogram";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

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

  return (
    <div className="h-fit w-full rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader title={plotConfig.title} />
      <VariableSelect
        options={plotConfig.variables}
        onChange={setCurrentVariable}
        currentVariable={currentVariable}
      />
      <HistogramPlot
        data={{
          isLoading,
          isError,
          metaIndicators,
        }}
      />
    </div>
  );
}
