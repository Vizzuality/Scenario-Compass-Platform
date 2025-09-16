import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { extractDataPoints } from "@/hooks/runs/filtering/utils";
import { useMemo } from "react";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  PRIMARY_ENERGY_BIOMASS_VARIABLE,
  PRIMARY_ENERGY_FOSSIL_VARIABLE,
  PRIMARY_ENERGY_RENEWABLES_VARIABLE,
  PRIMARY_ENERGY_VARIABLE,
  PRIMARY_ENERGY_VARIABLES,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";

export interface EnergyShare {
  [FOSSIL_SHARE_2050]: number;
  [RENEWABLES_SHARE_2050]: number;
  [BIOMASS_SHARE_2050]: number;
}

interface EnergyData {
  total: number;
  fossil: number;
  renewables: number;
  biomass: number;
}

export type EnergyShareMap = Record<string, EnergyShare>;

export default function useComputeEnergyShare() {
  const { geography } = useScenarioDashboardUrlParams();

  const { data, isLoading, isError } = useQuery({
    ...queryKeys.dataPoints.tabulate({
      variable: {
        // @ts-expect-error Not sufficient ts support
        name_in: [...PRIMARY_ENERGY_VARIABLES],
      },
      stepYear: 2050,
      region: { name: geographyConfig.find((g) => g.value === geography)?.lookupName },
    }),
    select: (data) => extractDataPoints(data),
  });

  const energyShares: EnergyShareMap | null = useMemo(() => {
    if (!data?.length) return null;

    const rawData: Record<string, EnergyData> = {};

    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const runId = point.runId;
      const variable = point.variable;
      const value = point.value;

      if (!rawData[runId]) {
        rawData[runId] = {
          total: 0,
          fossil: 0,
          renewables: 0,
          biomass: 0,
        };
      }

      if (variable === PRIMARY_ENERGY_VARIABLE) {
        rawData[runId].total = value;
      } else if (variable === PRIMARY_ENERGY_FOSSIL_VARIABLE) {
        rawData[runId].fossil = value;
      } else if (variable === PRIMARY_ENERGY_RENEWABLES_VARIABLE) {
        rawData[runId].renewables = value;
      } else if (variable === PRIMARY_ENERGY_BIOMASS_VARIABLE) {
        rawData[runId].biomass = value;
      }
    }

    const result: EnergyShareMap = {};
    for (const runId in rawData) {
      const data = rawData[runId];
      const total = data.total;

      result[runId] =
        total > 0
          ? {
              [FOSSIL_SHARE_2050]: (data.fossil / total) * 100,
              [RENEWABLES_SHARE_2050]: (data.renewables / total) * 100,
              [BIOMASS_SHARE_2050]: (data.biomass / total) * 100,
            }
          : {
              [FOSSIL_SHARE_2050]: 0,
              [RENEWABLES_SHARE_2050]: 0,
              [BIOMASS_SHARE_2050]: 0,
            };
    }

    return result;
  }, [data]);

  return {
    energyShares,
    isLoading,
    isError,
  };
}
