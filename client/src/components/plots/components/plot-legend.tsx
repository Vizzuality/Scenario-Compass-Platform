import { ExtendedRun } from "@/types/data/run";
import { getColorsForVariables, getOrderedVariableNames } from "@/utils/plots/colors-functions";

interface PlotWidgetProps {
  variablesMap: Record<string, string>;
  runs: ExtendedRun[];
}

const getActiveVariables = (runs: ExtendedRun[]) => {
  return new Set([...runs.map((run) => run.variableName)]);
};

export default function PlotLegend({ variablesMap, runs }: PlotWidgetProps) {
  const activeVariables = getActiveVariables(runs);

  const orderedVariableNames = getOrderedVariableNames(runs);
  const activeOrderedVariables = orderedVariableNames.filter((variable) =>
    activeVariables.has(variable),
  );
  const colors = getColorsForVariables(runs[0].flagCategory, activeOrderedVariables.length);

  const variableColorMap = new Map<string, string>();
  activeOrderedVariables.forEach((variable, index) => {
    const displayName = variablesMap[variable] || variable;
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
