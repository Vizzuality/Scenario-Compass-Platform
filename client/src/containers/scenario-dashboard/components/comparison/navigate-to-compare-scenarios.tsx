"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";
import { ComparisonFilterPopover } from "@/containers/scenario-dashboard/components/comparison/comparison-filter-popover";
import { SCENARIO_FILTER_OPTIONS } from "@/containers/scenario-dashboard/utils/url-store";
import {
  getParamName,
  useScenarioDashboardUrlParams,
} from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { LEFT_COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/constants";

const FILTER_OPTIONS = [
  { label: "Climate", value: SCENARIO_FILTER_OPTIONS.CLIMATE },
  { label: "Energy", value: SCENARIO_FILTER_OPTIONS.ENERGY },
  { label: "Land", value: SCENARIO_FILTER_OPTIONS.LAND },
];

const LEFT_PARAM_NAMES = {
  climate: getParamName(SCENARIO_FILTER_OPTIONS.CLIMATE, LEFT_COMPARISON_TAG),
  energy: getParamName(SCENARIO_FILTER_OPTIONS.ENERGY, LEFT_COMPARISON_TAG),
  land: getParamName(SCENARIO_FILTER_OPTIONS.LAND, LEFT_COMPARISON_TAG),
};

/**
 * Builds URL parameters for the comparison page based on selected filters.
 *
 * For each selected filter, adds the current value (or empty string if null)
 * to the URL parameters using the left-side parameter names.
 *
 * @param params - Configuration for building URL parameters
 * @param params.selectedFilters - Array of filter types selected for comparison
 * @param params.climate - Current climate filter value (optional)
 * @param params.energy - Current energy filter value (optional)
 * @param params.land - Current land filter value (optional)
 * @returns URLSearchParams object ready for navigation
 *
 * @example
 * buildComparisonParams({
 *   selectedFilters: ["climate", "energy"],
 *   climate: "C4",
 *   energy: null,
 *   land: "forest"
 * })
 * Creates: ?leftClimate=C4&leftEnergy=
 */
const buildComparisonParams = ({
  selectedFilters,
  climate,
  energy,
  land,
}: {
  selectedFilters: string[];
  climate?: string | null;
  energy?: string | null;
  land?: string | null;
}) => {
  const urlParams = new URLSearchParams();

  selectedFilters.forEach((filter) => {
    switch (filter) {
      case SCENARIO_FILTER_OPTIONS.CLIMATE:
        urlParams.set(LEFT_PARAM_NAMES.climate, climate || "");
        break;
      case SCENARIO_FILTER_OPTIONS.ENERGY:
        urlParams.set(LEFT_PARAM_NAMES.energy, energy || "");
        break;
      case SCENARIO_FILTER_OPTIONS.LAND:
        urlParams.set(LEFT_PARAM_NAMES.land, land || "");
        break;
    }
  });

  return urlParams;
};

/**
 * Navigation component for setting up scenario comparisons.
 *
 * This component provides a button with a popover that allows users to select
 * which scenario filters they want to compare. When applied, it:
 * 1. Clears the current scenario filters from the URL
 * 2. Copies the current filter values to the left side of the comparison
 * 3. Navigates to the comparison page
 *
 * The popover shows which filters are currently active (have values) and allows
 * users to select which ones they want to include in the comparison.
 *
 * @example
 * Usage in a page component
 * <NavigateToCompareScenarios />
 *
 * User workflow:
 * 1. User clicks "Compare this scenario set to +"
 * 2. Popover opens showing available filters (Climate, Energy, Land)
 * 3. User selects which filters to compare
 * 4. User clicks "Apply"
 * 5. Navigates to comparison page with selected filters on the left side
 */
export default function NavigateToCompareScenarios() {
  const router = useRouter();
  const { climate, energy, land, clearScenarioFilters, getActiveScenarioParams } =
    useScenarioDashboardUrlParams();
  const activeFilters = getActiveScenarioParams();

  const navigateToComparison = (urlParams: URLSearchParams) => {
    const comparisonUrl = `${INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON}?${urlParams.toString()}`;
    router.push(comparisonUrl);
  };

  /**
   * Handles the application of selected filters for comparison.
   *
   * This is the main handler that orchestrates the comparison setup:
   * 1. Clears current scenario filters to prepare for navigation
   * 2. Builds URL parameters for the selected filters
   * 3. Navigates to the comparison page
   *
   * @param selectedFilters - Array of filter option keys selected by the user
   * @throws Will log error to console if comparison setup fails
   *
   * @example
   * // User selects climate and energy filters
   * handleApply(["climate", "energy"])
   * Results in navigation to: /comparison?leftClimate=rcp45&leftEnergy=
   */
  const handleApply = async (selectedFilters: string[]) => {
    try {
      await clearScenarioFilters();
      const urlParams = buildComparisonParams({ selectedFilters, climate, energy, land });
      navigateToComparison(urlParams);
    } catch (error) {
      console.error("Failed to set up comparison:", error);
    }
  };

  return (
    <ComparisonFilterPopover
      selectedFilters={activeFilters}
      onApply={handleApply}
      options={FILTER_OPTIONS}
    >
      <Button className="mt-8">
        <span>Compare this scenario set to</span>
        <span className="ml-1 text-xl">+</span>
      </Button>
    </ComparisonFilterPopover>
  );
}
