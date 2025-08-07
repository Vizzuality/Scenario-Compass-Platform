"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";
import { ComparisonFilterPopover } from "@/containers/scenario-dashboard/components/comparison-filter-popover";
import {
  ScenarioFilterType,
  SCENARIO_FILTER_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";

export default function NavigateToCompareScenariosButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { climate, energy, land } = useScenarioDashboardUrlParams();

  const currentFilters = [climate, energy, land]
    .map((value, i) => (value ? Object.values(SCENARIO_FILTER_OPTIONS)[i] : null))
    .filter(Boolean) as ScenarioFilterType[];

  const handleApply = (filters: ScenarioFilterType[]) => {
    const params = new URLSearchParams(searchParams);
    if (filters.length) params.set("filters", filters.join(","));
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON}?${params}`);
  };

  return (
    <ComparisonFilterPopover selectedFilters={currentFilters} onApply={handleApply}>
      <Button className="mt-8">
        <p>Compare this scenario set to</p>
        <span className="text-xl">+</span>
      </Button>
    </ComparisonFilterPopover>
  );
}
