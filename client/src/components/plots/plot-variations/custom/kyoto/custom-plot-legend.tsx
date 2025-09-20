import { getColorsForVariables } from "@/components/plots/plot-variations/stacked-area/utils";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";

interface PlotWidgetProps {
  variables: string[];
  flagCategory: CategoryKey;
}

export default function CustomPlotLegend({ flagCategory, variables }: PlotWidgetProps) {
  const orderedVariableNames = variables.sort();
  const colors = getColorsForVariables(flagCategory, orderedVariableNames.length);

  const variableColorMap = new Map<string, string>();
  orderedVariableNames.forEach((variable, index) => {
    variableColorMap.set(variable, colors[index]);
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
