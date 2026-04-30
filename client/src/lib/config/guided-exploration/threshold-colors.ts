import { IS_PART_OF_AR_6 } from "@/lib/config/reasons-of-concern/category-config";
import { ExtendedRun } from "@/types/data/run";
import { ThresholdBand } from "@/lib/config/guided-exploration/capacity-thresholds";

const HIGH_COLOR = "#E33021";
const MEDIUM_COLOR = "#ED8936";
const NONE_COLOR = "#4EAD60";
const UNVETTED_COLOR = "#9CA3AF";

export type ConcernLevel = "high" | "medium" | "none";

/**
 * Determines the concern level by comparing a value against the high/medium bands.
 * It checks 'high' first because high concern overrides medium concern.
 */
export const getConcernLevel = (value: number, thresholds: ThresholdBand): ConcernLevel => {
  const { high, medium } = thresholds;

  // 1. High Concern Check
  // We check for undefined so variables without an upper/lower bound don't trigger false positives
  if (high.lower !== undefined && value < high.lower) return "high";
  if (high.upper !== undefined && value > high.upper) return "high";

  // 2. Medium Concern Check
  if (medium.lower !== undefined && value < medium.lower) return "medium";
  if (medium.upper !== undefined && value > medium.upper) return "medium";

  // 3. No Concern
  return "none";
};

export const createThresholdColorFn = (
  thresholds: ThresholdBand,
  year: number,
  includeUnvetted: boolean,
) => {
  return (run: ExtendedRun): string => {
    const isVetted = includeUnvetted
      ? true
      : run.metaIndicators.some((mi) => mi.key === IS_PART_OF_AR_6 && mi.value === "true");

    if (!isVetted) return UNVETTED_COLOR;

    const point = run.orderedPoints.find((p) => p.year === year);
    if (!point) return UNVETTED_COLOR;

    const level = getConcernLevel(point.value, thresholds);
    if (level === "high") return HIGH_COLOR;
    if (level === "medium") return MEDIUM_COLOR;
    return NONE_COLOR;
  };
};
