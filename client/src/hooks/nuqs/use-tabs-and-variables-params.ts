"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { TabConfig, TABS_CONFIG_ARRAY } from "@/lib/config/tabs-config";
import { PlotConfig } from "@/lib/config/variables-config";

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

  const allSelectedVariables = (): string[] => {
    if (selectedTab.isCustom || !selectedTab.explorationPlotConfigArray) return [];
    return selectedTab.explorationPlotConfigArray.map((plotConfig) => getVariable(plotConfig));
  };

  return {
    selectedTab,
    setSelectedTab,
    setVariable,
    getVariable,
    allSelectedVariables,
  };
}
