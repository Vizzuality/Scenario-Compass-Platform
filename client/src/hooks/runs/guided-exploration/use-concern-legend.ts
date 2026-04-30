"use client";

import { useQueryStates, parseAsBoolean } from "nuqs";
import { useCallback, useMemo } from "react";

export interface ConcernLegendItem {
  key: string;
  label: string;
  color: string;
  enabled: boolean;
  toggle: () => void;
}

interface UseConcernLegendReturn {
  showHigh: boolean;
  showMedium: boolean;
  showNone: boolean;
  legendItems: ConcernLegendItem[];
}

export function useConcernLegend({
  prefix = "",
}: { prefix?: string } = {}): UseConcernLegendReturn {
  const p = prefix ? `${prefix}-` : "";

  const [filters, setFilters] = useQueryStates({
    [`${p}high`]: parseAsBoolean.withDefault(true),
    [`${p}medium`]: parseAsBoolean.withDefault(true),
    [`${p}none`]: parseAsBoolean.withDefault(true),
  });

  const toggleHigh = useCallback(
    () => setFilters({ [`${p}high`]: !filters[`${p}high`] }),
    [filters, setFilters, p],
  );
  const toggleMedium = useCallback(
    () => setFilters({ [`${p}medium`]: !filters[`${p}medium`] }),
    [filters, setFilters, p],
  );
  const toggleNone = useCallback(
    () => setFilters({ [`${p}none`]: !filters[`${p}none`] }),
    [filters, setFilters, p],
  );

  const legendItems = useMemo(
    (): ConcernLegendItem[] => [
      {
        key: "high",
        label: "High concerns",
        color: "#E33021",
        enabled: filters[`${p}high`],
        toggle: toggleHigh,
      },
      {
        key: "medium",
        label: "Medium concerns",
        color: "#ED8936",
        enabled: filters[`${p}medium`],
        toggle: toggleMedium,
      },
      {
        key: "none",
        label: "No concerns",
        color: "#4EAD60",
        enabled: filters[`${p}none`],
        toggle: toggleNone,
      },
    ],
    [filters, p, toggleHigh, toggleMedium, toggleNone],
  );

  return {
    showHigh: filters[`${p}high`],
    showMedium: filters[`${p}medium`],
    showNone: filters[`${p}none`],
    legendItems,
  };
}
