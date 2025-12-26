import { ExtendedRun } from "@/types/data/run";
import { getVariableColorMap } from "@/utils/plots/colors-functions";

interface PlotWidgetProps {
  variablesMap: Record<string, string>;
  runs: ExtendedRun[];
}

export default function PlotLegend({ variablesMap, runs }: PlotWidgetProps) {
  const variableColorMap = getVariableColorMap(runs, variablesMap);

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pb-2">
      {[...variableColorMap.keys()].map((variable) => (
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
