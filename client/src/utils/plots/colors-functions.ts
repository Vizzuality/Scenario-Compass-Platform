import {
  CATEGORY_CONFIG,
  CategoryKey,
  getCategoryAbbrev,
} from "@/lib/config/reasons-of-concern/category-config";
import { ExtendedRun } from "@/types/data/run";
import { GREY, LIGHT_GREY } from "@/lib/config/plots/plots-constants";

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

  return colors;
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

export const getActiveVariables = (runs: ExtendedRun[]) => {
  return new Set([...runs.map((run) => run.variableName)]);
};

export const getVariableColorMap = (runs: ExtendedRun[], variablesMap: Record<string, string>) => {
  const activeVariables = getActiveVariables(runs);
  const variableNames = Object.keys(variablesMap);
  const presentVariables = variableNames.filter((variable) => activeVariables.has(variable));
  const colors = getColorsForVariables(runs[0].flagCategory, presentVariables.length);
  const variableColorMap = new Map<string, string>();
  presentVariables.forEach((variable, index) => {
    const displayName = variablesMap[variable] || variable;
    variableColorMap.set(displayName, colors[index]);
  });

  return variableColorMap;
};

export const getRunColor = (
  run: ExtendedRun,
  selectedFlags: string[],
  hasSelection: boolean,
): string => {
  if (!run.flagCategory) {
    return hasSelection ? LIGHT_GREY : GREY;
  }

  const abbrev = getCategoryAbbrev(run.flagCategory);

  if (abbrev && selectedFlags.includes(abbrev)) {
    const categoryKey = run.flagCategory as keyof typeof CATEGORY_CONFIG;
    const color = CATEGORY_CONFIG[categoryKey]?.color;
    return color || GREY;
  }

  return hasSelection ? LIGHT_GREY : GREY;
};
