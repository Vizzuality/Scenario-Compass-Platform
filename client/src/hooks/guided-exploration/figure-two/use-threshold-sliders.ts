"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import {
  FLAG_THRESHOLDS,
  ThresholdBand,
} from "@/lib/config/guided-exploration/capacity-thresholds";

interface UseThresholdSlidersParams {
  variable: string;
  bandName?: string;
}

interface UseThresholdSlidersReturn {
  thresholds: ThresholdBand;
  setHighLower: (v: number | null) => void;
  setHighUpper: (v: number | null) => void;
  setMediumLower: (v: number | null) => void;
  setMediumUpper: (v: number | null) => void;
  commitHighLower: (v: number | null) => void;
  commitHighUpper: (v: number | null) => void;
  commitMediumLower: (v: number | null) => void;
  commitMediumUpper: (v: number | null) => void;
  reset: () => void;
}

interface ThresholdSliderValues {
  highLower: number;
  highUpper: number;
  mediumLower: number;
  mediumUpper: number;
}

interface ThresholdSliderDraftState {
  key: string;
  values: ThresholdSliderValues;
}

type ThresholdField = keyof ThresholdSliderValues;

interface ThresholdFieldBounds {
  min?: number;
  max?: number;
}

const clamp = (value: number, min?: number, max?: number): number => {
  let nextValue = value;

  if (min !== undefined) nextValue = Math.max(nextValue, min);
  if (max !== undefined) nextValue = Math.min(nextValue, max);

  return nextValue;
};

const normalizeThresholds = (thresholds: ThresholdBand): ThresholdBand => {
  const highLower =
    thresholds.high.lower !== undefined
      ? clamp(
          thresholds.high.lower,
          undefined,
          Math.min(
            thresholds.medium.lower ?? Number.POSITIVE_INFINITY,
            thresholds.high.upper ?? Number.POSITIVE_INFINITY,
          ),
        )
      : undefined;

  const mediumUpper =
    thresholds.medium.upper !== undefined
      ? clamp(thresholds.medium.upper, thresholds.medium.lower, thresholds.high.upper)
      : undefined;

  const mediumLower =
    thresholds.medium.lower !== undefined
      ? clamp(
          thresholds.medium.lower,
          highLower,
          Math.min(
            mediumUpper ?? Number.POSITIVE_INFINITY,
            thresholds.high.upper ?? Number.POSITIVE_INFINITY,
          ),
        )
      : undefined;

  const highUpper =
    thresholds.high.upper !== undefined
      ? clamp(
          thresholds.high.upper,
          Math.max(highLower ?? Number.NEGATIVE_INFINITY, mediumUpper ?? Number.NEGATIVE_INFINITY),
        )
      : undefined;

  return {
    ...thresholds,
    high: {
      lower: highLower,
      upper: highUpper,
    },
    medium: {
      lower: mediumLower,
      upper: mediumUpper,
    },
  };
};

const buildThresholds = (
  defaults: ThresholdBand | undefined,
  values: ThresholdSliderValues,
): ThresholdBand => {
  return normalizeThresholds({
    name: defaults?.name ?? "",
    high: {
      lower: defaults?.high.lower !== undefined ? values.highLower : undefined,
      upper: defaults?.high.upper !== undefined ? values.highUpper : undefined,
    },
    medium: {
      lower: defaults?.medium.lower !== undefined ? values.mediumLower : undefined,
      upper: defaults?.medium.upper !== undefined ? values.mediumUpper : undefined,
    },
  });
};

const getDefaultSliderValues = (defaults: ThresholdBand | undefined): ThresholdSliderValues => ({
  highLower: defaults?.high.lower ?? 0,
  highUpper: defaults?.high.upper ?? 15000,
  mediumLower: defaults?.medium.lower ?? 0,
  mediumUpper: defaults?.medium.upper ?? 15000,
});

const getFieldBounds = (field: ThresholdField, thresholds: ThresholdBand): ThresholdFieldBounds => {
  switch (field) {
    case "highLower":
      return {
        max: Math.min(
          thresholds.medium.lower ?? Number.POSITIVE_INFINITY,
          thresholds.high.upper ?? Number.POSITIVE_INFINITY,
        ),
      };
    case "highUpper":
      return {
        min: Math.max(
          thresholds.high.lower ?? Number.NEGATIVE_INFINITY,
          thresholds.medium.upper ?? Number.NEGATIVE_INFINITY,
        ),
      };
    case "mediumLower":
      return {
        min: thresholds.high.lower,
        max: Math.min(
          thresholds.medium.upper ?? Number.POSITIVE_INFINITY,
          thresholds.high.upper ?? Number.POSITIVE_INFINITY,
        ),
      };
    case "mediumUpper":
      return {
        min: thresholds.medium.lower,
        max: thresholds.high.upper,
      };
  }
};

export function useThresholdSliders({
  variable,
  bandName,
}: UseThresholdSlidersParams): UseThresholdSlidersReturn {
  const bands = FLAG_THRESHOLDS[variable];
  const defaults = bandName ? (bands?.find((b) => b.name === bandName) ?? bands?.[0]) : bands?.[0];
  const thresholdKey = `${variable}-${defaults?.name ?? ""}`;
  const defaultSliderValues = useMemo(() => getDefaultSliderValues(defaults), [defaults]);

  const [draftState, setDraftState] = useState<ThresholdSliderDraftState>({
    key: thresholdKey,
    values: defaultSliderValues,
  });

  const draftValues = draftState.key === thresholdKey ? draftState.values : defaultSliderValues;

  useEffect(() => {
    setDraftState({ key: thresholdKey, values: defaultSliderValues });
  }, [defaultSliderValues, thresholdKey]);

  const thresholds = useMemo(
    (): ThresholdBand => buildThresholds(defaults, draftValues),
    [defaults, draftValues],
  );

  const setDraftFieldValue = useCallback(
    (field: ThresholdField, value: number) => {
      const { min, max } = getFieldBounds(field, thresholds);
      const nextValue = clamp(value, min, max);

      setDraftState((current) => ({
        key: thresholdKey,
        values: {
          ...(current.key === thresholdKey ? current.values : defaultSliderValues),
          [field]: nextValue,
        },
      }));
    },
    [defaultSliderValues, thresholdKey, thresholds],
  );

  const setSliderValue = useCallback(
    (field: ThresholdField, value: number | null) => {
      if (value === null) return;
      setDraftFieldValue(field, value);
    },
    [setDraftFieldValue],
  );

  const setHighLower = useCallback(
    (value: number | null) => setSliderValue("highLower", value),
    [setSliderValue],
  );
  const setHighUpper = useCallback(
    (value: number | null) => setSliderValue("highUpper", value),
    [setSliderValue],
  );
  const setMediumLower = useCallback(
    (value: number | null) => setSliderValue("mediumLower", value),
    [setSliderValue],
  );
  const setMediumUpper = useCallback(
    (value: number | null) => setSliderValue("mediumUpper", value),
    [setSliderValue],
  );

  const commitHighLower = useCallback(
    (value: number | null) => setSliderValue("highLower", value),
    [setSliderValue],
  );
  const commitHighUpper = useCallback(
    (value: number | null) => setSliderValue("highUpper", value),
    [setSliderValue],
  );
  const commitMediumLower = useCallback(
    (value: number | null) => setSliderValue("mediumLower", value),
    [setSliderValue],
  );
  const commitMediumUpper = useCallback(
    (value: number | null) => setSliderValue("mediumUpper", value),
    [setSliderValue],
  );

  const reset = useCallback(() => {
    setDraftState({ key: thresholdKey, values: defaultSliderValues });
  }, [defaultSliderValues, thresholdKey]);

  return {
    thresholds,
    setHighLower,
    setHighUpper,
    setMediumLower,
    setMediumUpper,
    commitHighLower,
    commitHighUpper,
    commitMediumLower,
    commitMediumUpper,
    reset,
  };
}
