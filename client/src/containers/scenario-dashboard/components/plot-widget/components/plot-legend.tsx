import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";

interface PlotWidgetProps {
  plotConfig: SingleScenarioPlotConfig;
  run: ExtendedRun;
}

export default function PlotLegend({ plotConfig, run }: PlotWidgetProps) {
  const categoryKey = run.flagCategory as keyof typeof CATEGORY_CONFIG;
  const palette = [...CATEGORY_CONFIG[categoryKey]?.palette];
  const variables = plotConfig.variables;

  const shortVariables = variables
    .map((variable) => {
      return variable.replace(plotConfig.parent, "").trim();
    })
    .sort()
    .reverse();

  const variableColorMap = new Map(
    shortVariables.map((variable, index) => [variable, palette[index % palette.length]]),
  );

  return (
    <div className="flex flex-wrap gap-4 pt-5">
      {shortVariables.map((variable) => (
        <div key={variable} className="flex items-center">
          <div
            className="mr-2 h-2.5 w-2.5 rounded"
            style={{ backgroundColor: variableColorMap.get(variable) }}
          />
          <span className="text-primary text-sm">{variable}</span>
        </div>
      ))}
    </div>
  );
}
