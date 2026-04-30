import {
  BenchmarkDataPoint,
  GroupBenchmarkData,
} from "@/hooks/runs/guided-exploration/figure-three/use-figure-three";
import { ExtendedRun } from "@/types/data/run";
import {
  FEASIBILITY_META_KEY,
  SUSTAINABILITY_META_KEY,
  VALUE_HIGH,
  VALUE_OK,
  VETTING2025,
} from "@/lib/config/reasons-of-concern/category-config";
import { matchesClimateCategoryFilter } from "@/utils/filtering";

const BASELINE_YEAR = 2020;

const isVetted = (run: ExtendedRun): boolean =>
  run.metaIndicators.some((mi) => mi.key === VETTING2025 && mi.value === VALUE_OK);

const hasNoConcern = (run: ExtendedRun): boolean => {
  const concernIndicators = run.metaIndicators.filter(
    (mi) => mi.key.startsWith(FEASIBILITY_META_KEY) || mi.key.startsWith(SUSTAINABILITY_META_KEY),
  );
  if (concernIndicators.length === 0) return true;
  return !concernIndicators.some((mi) => mi.value === VALUE_HIGH);
};

export const buildGroupData = (
  runs: ExtendedRun[],
  categoryFilter: string[],
  label: string,
  selectedYears: number[],
  includeUnvetted: boolean,
): GroupBenchmarkData => {
  const groupRuns = runs.filter((run) => matchesClimateCategoryFilter(run, categoryFilter));
  const allVetted: BenchmarkDataPoint[] = [];
  const noConcern: BenchmarkDataPoint[] = [];

  for (const run of groupRuns) {
    const baseline = run.orderedPoints.find((point) => point.year === BASELINE_YEAR)?.value;
    if (baseline === undefined || baseline === 0) continue;

    const vetted = isVetted(run);
    if (!vetted && !includeUnvetted) continue;

    const noConcernRun = vetted && hasNoConcern(run);

    for (const year of selectedYears) {
      if (year === BASELINE_YEAR) continue;

      const point = run.orderedPoints.find((p) => p.year === year);
      if (!point) continue;

      const dataPoint: BenchmarkDataPoint = {
        year,
        pctChange: ((point.value - baseline) / Math.abs(baseline)) * 100,
        runId: run.runId,
        run,
      };

      allVetted.push(dataPoint);
      if (noConcernRun) noConcern.push(dataPoint);
    }
  }

  return { label, allVetted, noConcern };
};
