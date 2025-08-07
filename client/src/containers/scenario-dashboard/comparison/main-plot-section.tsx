import React, { ComponentType } from "react";
import { TabItem, tabsArray } from "@/containers/scenario-dashboard/components/plots-section/utils";
import { GENERAL_VARIABLES_OPTIONS } from "@/lib/constants/variables-options";
import { LandFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/land-filter";
import { EnergyFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/energy-filter";
import { ClimateFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter";
import { SCENARIO_FILTER_OPTIONS } from "@/containers/scenario-dashboard/utils/url-store";
import { RowFilterProps } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import {
  getParamName,
  useScenarioDashboardUrlParams,
} from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import {
  LEFT_COMPARISON_TAG,
  RIGHT_COMPARISON_TAG,
} from "@/containers/scenario-dashboard/comparison/constants";
import { ComparisonFilterPopover } from "@/containers/scenario-dashboard/components/comparison/comparison-filter-popover";
import { Button } from "@/components/ui/button";
import LeftPanel from "@/containers/scenario-dashboard/comparison/left-panel";
import RightPanel from "@/containers/scenario-dashboard/comparison/right-panel";

export interface FilterArrayItem {
  /** URL parameter name for this filter (e.g., "leftClimate", "leftEnergy") */
  name: string;
  /** React component used to render this filter in the UI */
  component: ComponentType<RowFilterProps>;
}

/**
 * Configuration for all available scenario filter types.
 * This serves as the single source of truth for filter definitions.
 *
 * Each filter configuration includes:
 * - key: The filter option key from SCENARIO_FILTER_OPTIONS, like "CLIMATE", "ENERGY", "LAND" which will be "climate", "energy", "land" in the URL
 * - label: Human-readable display name for the filter
 * - component: React component that renders this filter type
 *
 * Adding a new filter:
 * { key: SCENARIO_FILTER_OPTIONS.WATER, label: "Water", component: WaterFilterRow }
 */
const MAIN_CONFIG = [
  { key: SCENARIO_FILTER_OPTIONS.CLIMATE, label: "Climate", component: ClimateFilterRow },
  { key: SCENARIO_FILTER_OPTIONS.ENERGY, label: "Energy", component: EnergyFilterRow },
  { key: SCENARIO_FILTER_OPTIONS.LAND, label: "Land", component: LandFilterRow },
] as const;

const LEFT_PARAM_NAMES = {
  climate: getParamName(SCENARIO_FILTER_OPTIONS.CLIMATE, LEFT_COMPARISON_TAG),
  energy: getParamName(SCENARIO_FILTER_OPTIONS.ENERGY, LEFT_COMPARISON_TAG),
  land: getParamName(SCENARIO_FILTER_OPTIONS.LAND, LEFT_COMPARISON_TAG),
};

const RIGHT_PARAM_NAMES = {
  climate: getParamName(SCENARIO_FILTER_OPTIONS.CLIMATE, RIGHT_COMPARISON_TAG),
  energy: getParamName(SCENARIO_FILTER_OPTIONS.ENERGY, RIGHT_COMPARISON_TAG),
  land: getParamName(SCENARIO_FILTER_OPTIONS.LAND, RIGHT_COMPARISON_TAG),
};

const FILTER_ARRAY: FilterArrayItem[] = MAIN_CONFIG.map((config) => ({
  name: LEFT_PARAM_NAMES[config.key],
  component: config.component,
}));

const FILTER_OPTIONS = MAIN_CONFIG.map((config) => ({
  label: config.label,
  value: LEFT_PARAM_NAMES[config.key],
}));

/**
 * Main component for the scenario comparison interface.
 *
 * This component provides a two-panel layout for comparing scenario filters.
 * Users can:
 * 1. Add new filters via a popover interface
 * 2. View active filters in both left and right panels
 * 3. Remove filters (which removes them from both sides)
 * 4. See visualizations based on the selected tab
 *
 * The component manages URL state for the left side of the comparison and
 * coordinates with the right side for filter removal operations.
 *
 * @param props - Component props
 * @param props.selectedTab - The currently selected tab which determines
 *                           what variables/visualizations are shown
 *
 * User workflow:
 *  1. User clicks "Add filter +" to open the filter selection popover
 *  2. User selects which filters to include (Climate, Energy, Land)
 *  3. Selected filters appear in both left and right panels
 *  4. User can configure individual filter values in each panel
 *  5. User can remove filters using the delete button (removes from both sides)
 */
export default function MainPlotSection({ selectedTab }: { selectedTab: TabItem }) {
  const { climate, energy, land, setFilters, getActiveScenarioParams } =
    useScenarioDashboardUrlParams(LEFT_COMPARISON_TAG);
  const { setFilters: setRightFilters } = useScenarioDashboardUrlParams(RIGHT_COMPARISON_TAG);
  const activeScenarioParams = getActiveScenarioParams();
  const currentSelectedVariables =
    tabsArray.find((tab) => tab.name === selectedTab)?.variables || GENERAL_VARIABLES_OPTIONS;

  /**
   * Filters that currently have non-null values.
   * These are the filters that will be displayed in both comparison panels.
   */
  const activeFilters = FILTER_ARRAY.filter((filter) => {
    if (filter.name === LEFT_PARAM_NAMES.climate) return climate !== null;
    if (filter.name === LEFT_PARAM_NAMES.energy) return energy !== null;
    if (filter.name === LEFT_PARAM_NAMES.land) return land !== null;
    return false;
  });

  /**
   * Removes a filter from both left and right sides of the comparison.
   *
   * This function:
   * 1. Identifies which filter type is being removed based on the parameter name
   * 2. Uses pre-generated parameter names for both left and right sides
   * 3. Removes the filter from both sides simultaneously using Promise.all
   *
   * @param name - The parameter name of the filter to remove (e.g., "leftClimate")
   * @throws Will silently return if the filter config is not found
   *
   * @example
   * // User clicks delete button on climate filter
   * await removeFilter("leftClimate");
   * // Result: Both leftClimate and rightClimate are removed from URL
   */
  const removeFilter = async (name: string) => {
    const filterConfig = MAIN_CONFIG.find((config) =>
      name.toLowerCase().includes(config.key.toLowerCase()),
    );

    if (!filterConfig) return;

    const leftParam = LEFT_PARAM_NAMES[filterConfig.key];
    const rightParam = RIGHT_PARAM_NAMES[filterConfig.key];

    await Promise.all([setFilters({ [leftParam]: null }), setRightFilters({ [rightParam]: null })]);
  };

  /**
   * Applies the selected filters from the popover to the URL state.
   *
   * This function:
   * 1. Identifies which filters were deselected and removes them from both sides
   * 2. Updates the left side with selected filters (preserving values or setting empty strings)
   * 3. Uses the existing removeFilter function to ensure bilateral cleanup
   *
   * @param selectedFilters - Array of parameter names that should be active
   *                         (e.g., ["leftClimate", "leftEnergy"])
   *
   * @example
   * // User selects Climate and Energy in popover, deselects Land
   * await handleApply(["leftClimate", "leftEnergy"]);
   * // Result:
   * //  1. removeFilter("leftLand") removes both leftLand and rightLand
   * //  2. leftClimate and leftEnergy are updated with current values or ""
   */
  const handleApply = async (selectedFilters: string[]) => {
    const deselectedFilters = Object.keys(LEFT_PARAM_NAMES).filter(
      (param) => !selectedFilters.includes(param),
    );

    await Promise.all(deselectedFilters.map((filterParam) => removeFilter(filterParam)));

    const currentValues = {
      [LEFT_PARAM_NAMES.climate]: climate,
      [LEFT_PARAM_NAMES.energy]: energy,
      [LEFT_PARAM_NAMES.land]: land,
    };

    const selectedUpdates = Object.fromEntries(
      selectedFilters.map((filterParam) => [filterParam, currentValues[filterParam] ?? ""]),
    );

    await setFilters(selectedUpdates);
  };

  return (
    <div className="container mx-auto my-8 space-y-4">
      <ComparisonFilterPopover
        selectedFilters={activeScenarioParams}
        options={FILTER_OPTIONS}
        onApply={handleApply}
      >
        <Button>Add filter +</Button>
      </ComparisonFilterPopover>

      <div className="grid grid-cols-2 gap-0">
        <LeftPanel filters={activeFilters} variables={currentSelectedVariables} />

        <RightPanel
          onDelete={activeScenarioParams.length > 1 ? removeFilter : undefined}
          filters={activeFilters}
          variables={currentSelectedVariables}
        />
      </div>
    </div>
  );
}
