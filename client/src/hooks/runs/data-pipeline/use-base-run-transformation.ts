import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { generateExtendedRuns } from "@/utils/data-manipulation/generate-extended-runs";
import { filterRunsByMetaIndicators } from "@/utils/filtering";
import { RunPipelineReturn } from "@/types/data/run";
import { DataPoint } from "@/types/data/data-point";
import useRequiredMetaIndicators from "@/hooks/runs/data-pipeline/use-required-meta-indicators";
import { useMemo } from "react";
import { MetaIndicator } from "@/types/data/meta-indicator";

const EMPTY_DATA_POINTS: DataPoint[] = [];
const EMPTY_META: MetaIndicator[] = [];

export default function useBaseRunTransformation({
  dataPoints,
  prefix = "",
}: {
  dataPoints: [] | DataPoint[] | undefined;
  prefix?: string;
}): RunPipelineReturn {
  const filters = useFilterUrlParams(prefix);

  const {
    energyShares,
    isLoading: isEnergyShareLoading,
    isError: isEnergyShareError,
  } = useComputeEnergyShare();

  const { gfaIncreaseArray, isLoading: isGfaLoading, isError: isGfaError } = useComputeLandUse();

  const {
    metaIndicators,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
  } = useRequiredMetaIndicators();

  const dp = dataPoints ?? EMPTY_DATA_POINTS;
  const mi = metaIndicators ?? EMPTY_META;

  const extendedRuns = useMemo(() => {
    if (
      isLoadingMeta ||
      isEnergyShareLoading ||
      isGfaLoading ||
      !dp.length ||
      !mi.length ||
      !energyShares
    ) {
      return [];
    }

    return generateExtendedRuns({
      dataPoints: dp,
      metaIndicators: mi,
      energyShares,
      gfaIncreaseArray,
    });
  }, [dp, mi, energyShares, gfaIncreaseArray, isLoadingMeta, isEnergyShareLoading, isGfaLoading]);

  const filteredRuns = useMemo(
    () =>
      filterRunsByMetaIndicators({
        runs: extendedRuns,
        climateCategory: filters.climateCategory,
        yearNetZero: filters.yearNetZero,
        carbonRemoval: filters.carbonRemoval,
        renewablesShare: filters.renewablesShare,
        biomassShare: filters.biomassShare,
        gfaIncrease: filters.gfaIncrease,
        fossilShare: filters.fossilShare,
        eocWarming: filters.eocWarming,
        peakWarming: filters.peakWarming,
        fossilFuelPhaseDown: filters.fossilFuelPhaseDown,
        mitigationStrategy: filters.mitigationStrategy,
      }),
    [
      extendedRuns,
      filters.climateCategory,
      filters.yearNetZero,
      filters.carbonRemoval,
      filters.renewablesShare,
      filters.biomassShare,
      filters.gfaIncrease,
      filters.fossilShare,
      filters.eocWarming,
      filters.peakWarming,
      filters.fossilFuelPhaseDown,
      filters.mitigationStrategy,
    ],
  );

  const isLoading = isLoadingMeta || isEnergyShareLoading || isGfaLoading;
  const isError = isErrorMeta || isEnergyShareError || isGfaError;

  return {
    runs: filteredRuns,
    isError,
    isLoading,
  };
}
