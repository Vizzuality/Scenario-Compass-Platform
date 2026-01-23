import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { generateExtendedRuns } from "@/utils/data-manipulation/generate-extended-runs";
import { filterRunsByMetaIndicators } from "@/utils/filtering";
import { RunPipelineReturn } from "@/types/data/run";
import { DataPoint } from "@/types/data/data-point";
import useRequiredMetaIndicators from "@/hooks/runs/data-pipeline/use-required-meta-indicators";

export default function useBaseRunTransformation({
  dataPoints,
  prefix = "",
}: {
  dataPoints: [] | DataPoint[] | undefined;
  prefix?: string;
}): RunPipelineReturn {
  const {
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
    eocWarming,
    peakWarming,
  } = useFilterUrlParams(prefix);

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

  const extendedRuns = generateExtendedRuns({
    dataPoints: dataPoints || [],
    metaIndicators: metaIndicators || [],
    energyShares,
    gfaIncreaseArray,
  });

  const filteredRuns = filterRunsByMetaIndicators({
    runs: extendedRuns,
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
    eocWarming,
    peakWarming,
  });

  const isLoading = isLoadingMeta || isEnergyShareLoading || isGfaLoading;
  const isError = isErrorMeta || isEnergyShareError || isGfaError;

  return {
    runs: filteredRuns,
    isError,
    isLoading,
  };
}
