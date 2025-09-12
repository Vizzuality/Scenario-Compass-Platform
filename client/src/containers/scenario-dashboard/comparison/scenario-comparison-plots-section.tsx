"use client";

import React, { ComponentType, useMemo } from "react";
import { LandFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/land-filter";
import { EnergyFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/energy-filter";
import { ClimateFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter";
import {
  SCENARIO_FILTER_OPTIONS,
  UNSET_FILTER_VALUE,
} from "@/containers/scenario-dashboard/utils/url-store";
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
import { ScenarioDashboardURLParamsKey } from "@/hooks/nuqs/types";

export interface FilterArrayItem {
  name: string;
  component: ComponentType<RowFilterProps>;
}

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

export default function ScenarioComparisonPlotsSection() {
  const { setFilters: setRightFilters } = useScenarioDashboardUrlParams(RIGHT_COMPARISON_TAG);
  const { setFilters: setLeftFilters, getActiveScenarioParams } =
    useScenarioDashboardUrlParams(LEFT_COMPARISON_TAG);

  const activeScenarioParams = getActiveScenarioParams();

  const activeFilters = useMemo(() => {
    return FILTER_ARRAY.filter((filter) => {
      return activeScenarioParams.includes(filter.name as ScenarioDashboardURLParamsKey);
    });
  }, [activeScenarioParams]);

  const removeFilter = async (name: string) => {
    const filterConfig = MAIN_CONFIG.find((config) =>
      name.toLowerCase().includes(config.key.toLowerCase()),
    );

    if (!filterConfig) return;

    const leftParam = LEFT_PARAM_NAMES[filterConfig.key];
    const rightParam = RIGHT_PARAM_NAMES[filterConfig.key];

    await Promise.all([
      setLeftFilters({ [leftParam]: null }),
      setRightFilters({ [rightParam]: null }),
    ]);
  };

  const handleApply = async (selectedFilters: string[]) => {
    const updates: Record<string, string[]> = {};

    selectedFilters.forEach((filter) => {
      if (!activeScenarioParams.includes(filter as ScenarioDashboardURLParamsKey)) {
        updates[filter] = [UNSET_FILTER_VALUE];
      }
    });

    if (Object.keys(updates).length > 0) {
      await setLeftFilters(updates);
    }
  };

  return (
    <div className="container mx-auto my-8 space-y-4">
      <ComparisonFilterPopover
        selectedFilters={activeScenarioParams}
        options={FILTER_OPTIONS}
        onApply={handleApply}
      >
        <Button className="gap-2.5">
          Add filter
          <span>+</span>
        </Button>
      </ComparisonFilterPopover>

      <div className="grid grid-cols-2 gap-0">
        <LeftPanel filters={activeFilters} />
        <RightPanel
          onDelete={activeScenarioParams.length > 1 ? removeFilter : undefined}
          filters={activeFilters}
        />
      </div>
    </div>
  );
}
