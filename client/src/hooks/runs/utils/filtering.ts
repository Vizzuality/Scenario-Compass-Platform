import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface FilterRunsByMetaIndicatorsParams {
  runs: ExtendedRun[];
  climate: string | null;
  energy: string | null;
  land: string | null;
}

export function filterRunsByMetaIndicators({
  runs,
  climate,
  energy,
  land,
}: FilterRunsByMetaIndicatorsParams): ExtendedRun[] {
  if (!runs?.length) {
    return [];
  }

  if (!climate && !energy && !land) {
    return runs;
  }

  const results: ExtendedRun[] = [];

  for (const run of runs) {
    if (!run.metaIndicators?.length) {
      continue;
    }

    let matchesClimate = !climate;
    let matchesEnergy = !energy;
    let matchesLand = !land;

    for (const metaPoint of run.metaIndicators) {
      const value = metaPoint.value;

      if (climate && !matchesClimate && value === climate) {
        matchesClimate = true;
      }
      if (energy && !matchesEnergy && value === energy) {
        matchesEnergy = true;
      }
      if (land && !matchesLand && value === land) {
        matchesLand = true;
      }

      // Early exit when all conditions are satisfied
      if (matchesClimate && matchesEnergy && matchesLand) {
        results.push(run);
        break;
      }
    }
  }

  return results;
}
