import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { getColorsForVariables } from "@/components/plots/utils/utils";
import { LIGHT_GREY, OTHER_GASES } from "@/components/plots/utils/constants";

interface PlotWidgetProps {
  variables: string[];
  flagCategory: CategoryKey;
}

export default function CustomPlotLegend({ flagCategory, variables }: PlotWidgetProps) {
  const orderedVariableNames = variables.sort();

  const nonOtherGasVariables = orderedVariableNames.filter((name) => name !== OTHER_GASES);
  const colors = getColorsForVariables(flagCategory, nonOtherGasVariables.length);

  const variableColorMap = new Map<string, string>();
  nonOtherGasVariables.forEach((variable, index) => {
    variableColorMap.set(variable, colors[index]);
  });
  variableColorMap.set(OTHER_GASES, LIGHT_GREY);

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
