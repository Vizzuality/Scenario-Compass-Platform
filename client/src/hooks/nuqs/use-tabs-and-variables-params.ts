"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { TabConfig, TABS_CONFIG_ARRAY } from "@/lib/config/tabs-config";
import { PlotConfig } from "@/lib/config/variables-config";
import { Variable } from "@iiasa/ixmp4-ts";

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function useTabAndVariablesParams(prefix?: string) {
  const varsParamName = prefix ? `${prefix}Vars` : "vars";

  const [variablesParam, setVariablesParam] = useQueryState(
    varsParamName,
    parseAsString.withDefault(""),
  );
  const [tabKey, setTabKey] = useQueryState(
    "tab",
    parseAsString.withDefault(TABS_CONFIG_ARRAY[0].tabTitle),
  );

  const selectedTab = useMemo(() => {
    const foundTab = TABS_CONFIG_ARRAY.find((tab) => tab.tabTitle === tabKey);
    return foundTab || TABS_CONFIG_ARRAY[0];
  }, [tabKey]);

  const setSelectedTab = (tab: TabConfig) => {
    setTabKey(tab.tabTitle);
    setVariablesParam("");
  };

  const getVariable = (plotConfig: PlotConfig, defaultIndex: number = 0): string => {
    const plotHash = hashString(plotConfig.title);
    const pair = variablesParam.split(",").find((p) => p.startsWith(`${plotHash}:`));
    if (!pair) return plotConfig.variables[0];
    const varIdx = Number(pair.split(":")[1]);
    return plotConfig.variables[isNaN(varIdx) ? defaultIndex : varIdx];
  };

  const setVariable = (plotConfig: PlotConfig, variable: string) => {
    const plotHash = hashString(plotConfig.title);
    const variableIndex = plotConfig.variables.indexOf(variable);
    const pairs = variablesParam ? variablesParam.split(",") : [];
    const newPairs = pairs.filter((p) => !p.startsWith(`${plotHash}:`));
    newPairs.push(`${plotHash}:${variableIndex}`);
    setVariablesParam(newPairs.join(","));
  };

  const setCustomVariable = ({
    plotIndex,
    variableId,
  }: {
    plotIndex: number;
    variableId: number;
  }) => {
    const pairs = variablesParam ? variablesParam.split(",") : [];
    const newPairs = pairs.filter((p) => !p.startsWith(`${plotIndex}:`));
    newPairs.push(`${plotIndex}:${variableId}`);
    setVariablesParam(newPairs.join(","));
  };

  const getCustomVariable = (plotIndex: number): number | null => {
    const pair = variablesParam.split(",").find((p) => p.startsWith(`${plotIndex}:`));
    if (!pair) return null;
    const varIdx = Number(pair.split(":")[1]);
    return isNaN(varIdx) ? null : varIdx;
  };

  const getAllCustomVariables = (variables: Variable[]): string[] => {
    if (!variablesParam || !variables?.length) return [];

    const varIds = variablesParam
      .split(",")
      .map((pair) => {
        const varIdx = Number(pair.split(":")[1]);
        return isNaN(varIdx) ? null : varIdx;
      })
      .filter((id): id is number => id !== null);

    return variables
      .filter((variable) => varIds.includes(variable.id))
      .map((variable) => variable.name);
  };

  const allSelectedVariables = (): string[] => {
    if (selectedTab.isCustom || !selectedTab.explorationPlotConfigArray) return [];
    return selectedTab.explorationPlotConfigArray.map((plotConfig) => getVariable(plotConfig));
  };

  return {
    selectedTab,
    setSelectedTab,
    setVariable,
    setCustomVariable,
    getCustomVariable,
    getVariable,
    allSelectedVariables,
    getAllCustomVariables,
  };
}
