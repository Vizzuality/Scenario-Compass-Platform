"use client";

import { useQueryStates, parseAsBoolean } from "nuqs";
import { useCallback, useMemo } from "react";
import {
  UNVETTED_COLOR,
  VETTED_COLOR,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  enabled: boolean;
  toggle: () => void;
}

interface UseScatterLegendReturn {
  showVetted: boolean;
  showUnvetted: boolean;
  legendItems: LegendItem[];
}

export function useScatterLegend({
  prefix = "",
  unvettedColor = UNVETTED_COLOR,
  vettedColor = VETTED_COLOR,
  vettedLabel = "In AR6 Ensemble",
  unvettedLabel = "Not in AR6 Ensemble",
}: {
  prefix?: string;
  vettedColor?: string;
  unvettedColor?: string;
  vettedLabel?: string;
  unvettedLabel?: string;
} = {}): UseScatterLegendReturn {
  const p = prefix ? `${prefix}-` : "";

  const [filters, setFilters] = useQueryStates({
    [`${p}vetted`]: parseAsBoolean.withDefault(true),
    [`${p}unvetted`]: parseAsBoolean.withDefault(true),
  });

  const toggleVetted = useCallback(
    () => setFilters({ [`${p}vetted`]: !filters[`${p}vetted`] }),
    [filters, setFilters, p],
  );
  const toggleUnvetted = useCallback(
    () => setFilters({ [`${p}unvetted`]: !filters[`${p}unvetted`] }),
    [filters, setFilters, p],
  );

  const legendItems = useMemo(
    (): LegendItem[] => [
      {
        key: "vetted",
        label: vettedLabel,
        color: vettedColor,
        enabled: filters[`${p}vetted`],
        toggle: toggleVetted,
      },
      {
        key: "unvetted",
        label: unvettedLabel,
        color: unvettedColor,
        enabled: filters[`${p}unvetted`],
        toggle: toggleUnvetted,
      },
    ],
    [
      filters,
      p,
      vettedColor,
      unvettedColor,
      vettedLabel,
      unvettedLabel,
      toggleVetted,
      toggleUnvetted,
    ],
  );

  return {
    showVetted: filters[`${p}vetted`],
    showUnvetted: filters[`${p}unvetted`],
    legendItems,
  };
}
