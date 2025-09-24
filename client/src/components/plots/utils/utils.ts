import { CATEGORY_CONFIG, CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

export const getColorsForVariables = (
  flagCategory: CategoryKey,
  variableCount: number,
): string[] => {
  const categoryKey = flagCategory as keyof typeof CATEGORY_CONFIG;
  const palette = CATEGORY_CONFIG[categoryKey].palette;

  const colors = [];

  const startIndex = Math.max(0, palette.length - variableCount);
  for (let i = 0; i < variableCount; i++) {
    colors.push(palette[startIndex + i]);
  }

  return colors.reverse();
};

export const createVariableColorMap = (
  variableNames: string[],
  colors: string[],
): Map<string, string> => {
  const colorMap = new Map<string, string>();
  variableNames.forEach((variable, index) => {
    colorMap.set(variable, colors[index]);
  });
  return colorMap;
};

export const getOrderedVariableNames = (runs: ExtendedRun[]): string[] => {
  const variableNames = [...new Set(runs.map((run) => run.variableName))];
  return variableNames.sort((a, b) => a.localeCompare(b));
};
