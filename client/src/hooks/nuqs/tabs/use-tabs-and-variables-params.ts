"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { TabConfig, TABS_CONFIG_ARRAY } from "@/lib/config/tabs/tabs-config";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { Variable } from "@iiasa/ixmp4-ts";

/**
 * Generates a deterministic hash string from an input string.
 * Used to create short, unique identifiers for plot configurations.
 *
 * @param str - The string to hash
 * @returns A base-36 encoded hash string
 *
 * @example
 * ```ts
 * hashString("Decarbonization"); -> Returns something like "sxzl92"
 * ```
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Custom hook for managing tab navigation and variable selection state through URL query parameters.
 * Provides synchronized state management for persisting user selections across page reloads and enabling shareable URLs.
 *
 * @param prefix - Optional prefix for the variables query parameter name. Results in `{prefix}Vars` (e.g., "main" → "mainVars")
 *
 * @returns An object containing tab and variable state management functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { selectedTab, setSelectedTab, getVariable, setVariable } = useTabAndVariablesParams();
 *
 *   return (
 *     <div>
 *       <h2>{selectedTab.tabTitle}</h2>
 *       {selectedTab.explorationPlotConfigArray?.map((plot) => (
 *         <PlotComponent
 *           key={plot.title}
 *           selectedVariable={getVariable(plot)}
 *           onVariableChange={(variable) => setVariable(plot, variable)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Using a prefix for multiple independent instances:
 * ```tsx
 * function ComparisonView() {
 *   const left = useTabAndVariablesParams("left");
 *   const right = useTabAndVariablesParams("right");
 *   -> URL will have: ?tab=...&leftVars=...&rightVars=...
 * }
 * ```
 *  How does this work ?
 *
 *  For Custom Tab where the user is able to pick its own variables to see plots based on,
 *  The URL will be like '?tab=custom&vars=0:844,1:822' where the tab is the custom one, and the vars array represents the plots and the ID of the variable.
 *  For plot index 0: there is variable with id 844, -> "Agricultural Production|Demand ..."
 *
 *  For the rest of the tabs, '/exploration?tab=energy&vars=sxzl92:1' the hashed key represents the title of the plot and the value is the index of the variable name in the plot config. variables.
 */
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

  /**
   * Retrieves the currently selected variable for a specific plot configuration.
   * Uses a hash of the plot title to identify stored selections.
   *
   * @param plotConfig - The plot configuration object
   * @param defaultIndex - Optional index to use if parsing fails (default: 0)
   * @returns The selected variable name as a string
   *
   * @example
   * ```tsx
   * const selectedVariable = getVariable(plotConfig);
   * console.log(selectedVariable); -> "Secondary Energy|Electricity"
   * ```
   */
  const getVariable = (plotConfig: PlotConfig, defaultIndex: number = 0): string => {
    const plotHash = hashString(plotConfig.title);
    const pair = variablesParam.split(",").find((p) => p.startsWith(`${plotHash}:`));
    if (!pair) return plotConfig.variables[0];
    const varIdx = Number(pair.split(":")[1]);
    return plotConfig.variables[isNaN(varIdx) ? defaultIndex : varIdx];
  };

  /**
   * Sets the selected variable for a specific plot configuration.
   * Variables are stored as comma-separated pairs in the format: `hash:index,hash:index`
   *
   * @param plotConfig - The plot configuration object
   * @param variable - The variable name to select (must exist in plotConfig.variables)
   *
   * @example
   * ```tsx
   * setVariable(plotConfig, "Precipitation");
   * // URL becomes: ?vars=a1b2c3:2
   * ```
   */
  const setVariable = (plotConfig: PlotConfig, variable: string) => {
    const plotHash = hashString(plotConfig.title);
    const variableIndex = plotConfig.variables.indexOf(variable);
    const pairs = variablesParam ? variablesParam.split(",") : [];
    const newPairs = pairs.filter((p) => !p.startsWith(`${plotHash}:`));
    newPairs.push(`${plotHash}:${variableIndex}`);
    setVariablesParam(newPairs.join(","));
  };

  /**
   * Sets a custom variable selection using numeric identifiers.
   * Used for custom tabs or dynamic plot configurations where plot configs aren't predetermined.
   *
   * @param params - Object containing plotIndex and variableId
   * @param params.plotIndex - The numeric index of the plot
   * @param params.variableId - The numeric ID of the variable
   *
   * @example
   * ```tsx
   * setCustomVariable({ plotIndex: 0, variableId: 42 });
   * // URL becomes: ?vars=0:42
   * ```
   */
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

  /**
   * Retrieves the variable ID for a custom plot by its index.
   *
   * @param plotIndex - The numeric index of the plot
   * @returns The variable ID as a number, or null if not found or invalid
   */
  const getCustomVariableForPlotIndex = (plotIndex: number): number | null => {
    const pair = variablesParam.split(",").find((p) => p.startsWith(`${plotIndex}:`));
    if (!pair) return null;
    const varIdx = Number(pair.split(":")[1]);
    return isNaN(varIdx) ? null : varIdx;
  };

  /**
   * Extracts all currently selected variable names for custom variables.
   * Parses ALL variable IDs from the URL parameter and matches them against the provided variables array.
   *
   * @param variables - Array of available variable objects with id and name properties
   * @returns Array of selected variable names
   *
   * @example
   * ```tsx
   * const allVars = getAllCustomVariables(variablesArray);
   * console.log(allVars); -> ["Temperature", "Humidity", "Pressure"]
   * ```
   */
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

  /**
   * Returns all selected variables for the current tab's plot configurations.
   *
   * @returns Array of variable names, or empty array if tab is custom or has no plots
   *
   * @example
   * ```tsx
   * const selected = allSelectedVariables();
   * console.log(selected); -> ["CO2 Emissions", "Population"]
   * ```
   */
  const allSelectedVariables = (): string[] => {
    if (selectedTab.isCustom || !selectedTab.explorationPlotConfigArray) return [];
    return selectedTab.explorationPlotConfigArray.map((plotConfig) => getVariable(plotConfig));
  };

  return {
    selectedTab,
    setSelectedTab,
    setVariable,
    setCustomVariable,
    getCustomVariable: getCustomVariableForPlotIndex,
    getVariable,
    allSelectedVariables,
    getAllCustomVariables,
  };
}
