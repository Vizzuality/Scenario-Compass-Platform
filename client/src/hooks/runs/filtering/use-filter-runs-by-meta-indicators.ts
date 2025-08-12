import { useMemo } from "react";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";

interface Props {
  runs: ExtendedRun[];
  climate: string | null;
  energy: string | null;
  land: string | null;
}

export function useFilterRunsByMetaIndicators({
  runs,
  climate,
  energy,
  land,
}: Props): ExtendedRun[] {
  return useMemo(() => {
    if (!runs?.length) {
      return [];
    }

    if (!climate && !energy && !land) {
      return runs;
    }

    return runs.filter((run) => {
      if (!run.metaIndicators?.length) {
        return false;
      }

      let matchesClimate = !climate;
      let matchesEnergy = !energy;
      let matchesLand = !land;

      run.metaIndicators.forEach((metaPoint) => {
        if (climate && metaPoint.value === climate) {
          matchesClimate = true;
        }
        if (energy && metaPoint.value === energy) {
          matchesEnergy = true;
        }
        if (land && metaPoint.value === land) {
          matchesLand = true;
        }
      });

      return matchesClimate && matchesEnergy && matchesLand;
    });
  }, [runs, climate, energy, land]);
}
