import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import {
  getColorsForVariables,
  getOrderedVariableNames,
} from "@/components/plots/plot-variations/stacked-area/utils";

interface PlotWidgetProps {
  plotConfig: SingleScenarioPlotConfig;
  runs: ExtendedRun[];
}

const getActiveVariables = (runs: ExtendedRun[]) => {
  return new Set([...runs.map((run) => run.variableName)]);
};

export default function PlotLegend({ plotConfig, runs }: PlotWidgetProps) {
  const activeVariables = getActiveVariables(runs);

  const orderedVariableNames = getOrderedVariableNames(runs);
  const activeOrderedVariables = orderedVariableNames.filter((variable) =>
    activeVariables.has(variable),
  );
  const colors = getColorsForVariables(runs, activeOrderedVariables.length);

  const variableColorMap = new Map<string, string>();
  activeOrderedVariables.forEach((variable, index) => {
    const displayName = plotConfig.variablesMap[variable] || variable;
    variableColorMap.set(displayName, colors[index]);
  });

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pb-2">
      {[...variableColorMap.keys()].reverse().map((variable) => (
        <div key={variable} className="flex items-center">
          <div
            className="border-foreground mr-2 h-2.5 w-2.5 rounded-full border"
            style={{ backgroundColor: variableColorMap.get(variable) }}
          />
          <span className="text-primary text-sm whitespace-nowrap">{variable}</span>
        </div>
      ))}
    </div>
  );
}
