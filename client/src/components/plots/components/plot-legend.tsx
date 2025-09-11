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

  const variableColorMap = new Map(
    plotConfig.legendVariables.map((variable, index) => [
      variable,
      palette[index % palette.length],
    ]),
  );

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pb-2">
      {plotConfig.legendVariables.map((variable) => (
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
