import { parseAsString, useQueryStates } from "nuqs";
import { SCENARIO_DASHBOARD_META_INDICATORS_FILTER_SEARCH_PARAMS } from "@/containers/scenario-dashboard/utils/url-store";

export function useScenarioDashboardMetaIndicatorsFilterUrl() {
  const [filters, setFilters] = useQueryStates({
    [SCENARIO_DASHBOARD_META_INDICATORS_FILTER_SEARCH_PARAMS.CLIMATE]: parseAsString,
    [SCENARIO_DASHBOARD_META_INDICATORS_FILTER_SEARCH_PARAMS.ENERGY]: parseAsString,
    [SCENARIO_DASHBOARD_META_INDICATORS_FILTER_SEARCH_PARAMS.LAND]: parseAsString,
  });

  const setClimate = (value: string) => {
    setFilters({
      climate: value,
    });
  };

  const setEnergy = (value: string) => {
    setFilters({
      energy: value,
    });
  };

  const setLand = (value: string) => {
    setFilters({
      land: value,
    });
  };

  return {
    climate: filters.climate,
    land: filters.land,
    energy: filters.energy,
    setClimate,
    setLand,
    setEnergy,
  };
}
