"use client";

import { useQueryStates, parseAsFloat } from "nuqs";
import { useCallback, useMemo, useEffect } from "react";
import {
  FLAG_THRESHOLDS,
  ThresholdBand,
} from "@/lib/config/guided-exploration/capacity-thresholds";
import { FIG_TWO_PREFIX } from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";

interface UseThresholdSlidersParams {
  variable: string;
  bandName?: string;
  prefix?: string;
}

interface UseThresholdSlidersReturn {
  thresholds: ThresholdBand;
  setHighLower: (v: number | null) => void;
  setHighUpper: (v: number | null) => void;
  setMediumLower: (v: number | null) => void;
  setMediumUpper: (v: number | null) => void;
  reset: () => void;
}

export function useThresholdSliders({
  variable,
  bandName,
  prefix = FIG_TWO_PREFIX,
}: UseThresholdSlidersParams): UseThresholdSlidersReturn {
  const bands = FLAG_THRESHOLDS[variable];
  const defaults = bandName ? (bands?.find((b) => b.name === bandName) ?? bands?.[0]) : bands?.[0];

  const p = prefix ? `${prefix}-` : "";

  const [filters, setFilters] = useQueryStates({
    [`${p}hl`]: parseAsFloat.withDefault(defaults?.high.lower ?? 0),
    [`${p}hu`]: parseAsFloat.withDefault(defaults?.high.upper ?? 15000),
    [`${p}ml`]: parseAsFloat.withDefault(defaults?.medium.lower ?? 0),
    [`${p}mu`]: parseAsFloat.withDefault(defaults?.medium.upper ?? 15000),
  });

  // Reset when variable or band changes
  useEffect(() => {
    setFilters({
      [`${p}hl`]: null,
      [`${p}hu`]: null,
      [`${p}ml`]: null,
      [`${p}mu`]: null,
    });
  }, [variable, bandName, p, setFilters]);

  const thresholds = useMemo(
    (): ThresholdBand => ({
      name: defaults?.name ?? "",
      high: {
        lower:
          defaults?.high.lower !== undefined
            ? (filters[`${p}hl`] ?? defaults.high.lower)
            : undefined,
        upper:
          defaults?.high.upper !== undefined
            ? (filters[`${p}hu`] ?? defaults.high.upper)
            : undefined,
      },
      medium: {
        lower:
          defaults?.medium.lower !== undefined
            ? (filters[`${p}ml`] ?? defaults.medium.lower)
            : undefined,
        upper:
          defaults?.medium.upper !== undefined
            ? (filters[`${p}mu`] ?? defaults.medium.upper)
            : undefined,
      },
    }),
    [filters, defaults, p],
  );

  const setHighLower = useCallback(
    (v: number | null) => setFilters({ [`${p}hl`]: v }),
    [setFilters, p],
  );
  const setHighUpper = useCallback(
    (v: number | null) => setFilters({ [`${p}hu`]: v }),
    [setFilters, p],
  );
  const setMediumLower = useCallback(
    (v: number | null) => setFilters({ [`${p}ml`]: v }),
    [setFilters, p],
  );
  const setMediumUpper = useCallback(
    (v: number | null) => setFilters({ [`${p}mu`]: v }),
    [setFilters, p],
  );

  const reset = useCallback(() => {
    setFilters({
      [`${p}hl`]: null,
      [`${p}hu`]: null,
      [`${p}ml`]: null,
      [`${p}mu`]: null,
    });
  }, [setFilters, p]);

  return {
    thresholds,
    setHighLower,
    setHighUpper,
    setMediumLower,
    setMediumUpper,
    reset,
  };
}
