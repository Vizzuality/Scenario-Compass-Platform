import { ExtendedRun } from "@/types/data/run";
import {
  getCategoryAbbrev,
  VALUE_OK,
  VETTING2025,
} from "@/lib/config/reasons-of-concern/category-config";

export const hasVettingFlag = (run: ExtendedRun): boolean =>
  run.metaIndicators.some((mi) => mi.key === VETTING2025 && mi.value === VALUE_OK);

const isHiddenByFlag = (run: ExtendedRun, hiddenFlags: string[]): boolean => {
  if (hiddenFlags.length === 0 || !run.flagCategory) return false;
  const abbrev = getCategoryAbbrev(run.flagCategory);
  return abbrev ? hiddenFlags.includes(abbrev) : false;
};

export const filterDecadePoints = (extendedRuns: ExtendedRun[]) => {
  return extendedRuns.map((run) => {
    return {
      ...run,
      orderedPoints: run.orderedPoints.filter((point) => {
        if (point.year > 2050) {
          return point.year % 10 === 0;
        } else {
          return point.year % 5 === 0;
        }
      }),
    };
  });
};

export const filterVisibleRuns = (
  runs: ExtendedRun[],
  hiddenFlags: string[],
  showVetting: boolean,
): ExtendedRun[] => {
  let workingRuns: ExtendedRun[];

  if (!showVetting) {
    workingRuns = runs.filter((run) => {
      return hasVettingFlag(run);
    });
  } else {
    workingRuns = runs;
  }

  return workingRuns.filter((run) => {
    const isHidden = isHiddenByFlag(run, hiddenFlags);
    return !isHidden;
  });
};
