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

const buildComparisonParams = ({
  selectedFilters,
  climate,
  energy,
  land,
}: {
  selectedFilters: string[];
  climate?: string[] | null;
  energy?: string[] | null;
  land?: string[] | null;
}) => {
  const urlParams = new URLSearchParams(window.location.search);

  selectedFilters.forEach((filter) => {
    switch (filter) {
      case SCENARIO_FILTER_OPTIONS.CLIMATE:
        const climateValue = climate && climate.length > 0 ? climate.join(",") : "";
        urlParams.set(LEFT_PARAM_NAMES.climate, climateValue);
        break;
      case SCENARIO_FILTER_OPTIONS.ENERGY:
        const energyValue = energy && energy.length > 0 ? energy.join(",") : "";
        urlParams.set(LEFT_PARAM_NAMES.energy, energyValue);
        break;
      case SCENARIO_FILTER_OPTIONS.LAND:
        const landValue = land && land.length > 0 ? land.join(",") : "";
        urlParams.set(LEFT_PARAM_NAMES.land, landValue);
        break;
    }
  });

  return urlParams;
};

export default function NavigateToCompareScenarios() {
  const router = useRouter();
  const { climate, energy, land, clearScenarioFilters, getActiveScenarioParams } =
    useScenarioDashboardUrlParams();
  const activeFilters = getActiveScenarioParams();

  const navigateToComparison = (urlParams: URLSearchParams) => {
    const comparisonUrl = `${INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON}?${urlParams.toString()}`;
    router.push(comparisonUrl);
  };

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
