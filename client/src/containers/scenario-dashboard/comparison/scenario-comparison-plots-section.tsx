"use client";

import React, { ComponentType, useEffect, useState } from "react";
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
  const { climate, energy, land, setFilters, getActiveScenarioParams } =
    useScenarioDashboardUrlParams(LEFT_COMPARISON_TAG);
  const { setFilters: setRightFilters } = useScenarioDashboardUrlParams(RIGHT_COMPARISON_TAG);
  const activeScenarioParams = getActiveScenarioParams();

  const [clientActiveFilters, setClientActiveFilters] = useState<FilterArrayItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      const active = FILTER_ARRAY.filter((filter) => {
        if (filter.name === LEFT_PARAM_NAMES.climate) {
          return urlParams.has("leftClimate");
        }
        if (filter.name === LEFT_PARAM_NAMES.energy) {
          return urlParams.has("leftEnergy");
        }
        if (filter.name === LEFT_PARAM_NAMES.land) {
          return urlParams.has("leftLand");
        }
        return false;
      });

      setClientActiveFilters(active);
    }
  }, [climate, energy, land]);

  const removeFilter = async (name: string) => {
    const filterConfig = MAIN_CONFIG.find((config) =>
      name.toLowerCase().includes(config.key.toLowerCase()),
    );

    if (!filterConfig) return;

    const leftParam = LEFT_PARAM_NAMES[filterConfig.key];
    const rightParam = RIGHT_PARAM_NAMES[filterConfig.key];

    await Promise.all([setFilters({ [leftParam]: null }), setRightFilters({ [rightParam]: null })]);
  };

  return (
    <div className="container mx-auto my-8 space-y-4">
      <ComparisonFilterPopover
        selectedFilters={clientActiveFilters.map((filter) => filter.name)}
        options={FILTER_OPTIONS}
        onApply={() => {}}
      >
        <Button className="gap-2.5">
          Add filter
          <span>+</span>
        </Button>
      </ComparisonFilterPopover>

      <div className="grid grid-cols-2 gap-0">
        <LeftPanel filters={clientActiveFilters} />
        <RightPanel
          onDelete={activeScenarioParams.length > 1 ? removeFilter : undefined}
          filters={clientActiveFilters}
        />
      </div>
    </div>
  );
}
