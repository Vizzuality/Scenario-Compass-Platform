import {
  BenchmarkDataPoint,
  GroupBenchmarkData,
} from "@/hooks/guided-exploration/figure-three/use-figure-three";
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
const FIXED_BASELINES_BY_VARIABLE: Record<string, { year: number; value: number }> = {
  "Emissions|Kyoto Gases": { year: 2019, value: 59090 },
  "Emissions|CO2|Energy and Industrial Processes": { year: 2019, value: 37086 },
  "Primary Energy|Non-Biomass Renewables": { year: 2019, value: 28.65 },
};

export const getVariableBaselineYear = (variable: string): number =>
  FIXED_BASELINES_BY_VARIABLE[variable]?.year ?? BASELINE_YEAR;

const getBaselineValue = (run: ExtendedRun): number | undefined =>
  FIXED_BASELINES_BY_VARIABLE[run.variableName]?.value ??
  run.orderedPoints.find((point) => point.year === BASELINE_YEAR)?.value;

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
): GroupBenchmarkData => {
  const groupRuns = runs.filter((run) => matchesClimateCategoryFilter(run, categoryFilter));
  const allVetted: BenchmarkDataPoint[] = [];
  const withUnvetted: BenchmarkDataPoint[] = [];
  const noConcern: BenchmarkDataPoint[] = [];

  for (const run of groupRuns) {
    const baseline = getBaselineValue(run);
    if (baseline === undefined || baseline === 0) continue;

    const vetted = isVetted(run);
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

      if (vetted) allVetted.push(dataPoint);
      withUnvetted.push(dataPoint);
      if (noConcernRun) noConcern.push(dataPoint);
    }
  }

  return { label, allVetted, withUnvetted, noConcern };
};

export const buildMetaIndicatorGroupData = (
  runs: ExtendedRun[],
  categoryFilter: string[],
  label: string,
  metaIndicatorKey: string,
  bucket: number,
): GroupBenchmarkData => {
  const groupRuns = runs.filter((run) => matchesClimateCategoryFilter(run, categoryFilter));
  const allVetted: BenchmarkDataPoint[] = [];
  const withUnvetted: BenchmarkDataPoint[] = [];
  const noConcern: BenchmarkDataPoint[] = [];

  for (const run of groupRuns) {
    const metaIndicator = run.metaIndicators.find(
      (indicator) => indicator.key === metaIndicatorKey,
    );
    const value = metaIndicator ? Number.parseFloat(metaIndicator.value) : Number.NaN;
    if (!Number.isFinite(value)) continue;

    const vetted = isVetted(run);
    const noConcernRun = vetted && hasNoConcern(run);
    const dataPoint: BenchmarkDataPoint = {
      year: bucket,
      pctChange: value,
      runId: run.runId,
      run,
    };

    if (vetted) allVetted.push(dataPoint);
    withUnvetted.push(dataPoint);
    if (noConcernRun) noConcern.push(dataPoint);
  }

  return { label, allVetted, withUnvetted, noConcern };
};
