import { useId } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import { ChangeStateAction, SliderSelectItem } from "@/components/slider-select";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { parseRange } from "@/components/slider-select/utils";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";

export const useEnergyFilter = (prefix?: string) => {
  const id = useId();
  const {
    renewablesShare,
    fossilShare,
    biomassShare,
    setFossilShare,
    setBiomassShare,
    setRenewablesShare,
  } = useFilterUrlParams(prefix);

  const energyItems: Array<SliderSelectItem> = [
    {
      id: FOSSIL_SHARE_2050,
      label: "Share of fossil fuel in primary energy in 2050",
      value: parseRange(fossilShare),
      defaultRange: [0, 100],
    },
    {
      id: RENEWABLES_SHARE_2050,
      label: "Share of renewables in primary energy in 2050",
      value: parseRange(renewablesShare),
      defaultRange: [0, 100],
    },
    {
      id: BIOMASS_SHARE_2050,
      label: "Share of biomass in 2050",
      value: parseRange(biomassShare),
      defaultRange: [0, 100],
    },
  ];

  const setters: Record<string, (value: string | null) => Promise<URLSearchParams>> = {
    renewablesShare: setRenewablesShare,
    fossilShare: setFossilShare,
    biomassShare: setBiomassShare,
  };

  const handleApply = (selections: ChangeStateAction) => {
    Object.entries(selections).forEach(([key, value]) => {
      const setter = setters[key];
      const stringifierValue = value ? value.join(URL_VALUES_FILTER_SEPARATOR) : null;
      setter?.(stringifierValue);
    });
  };

  return { id, energyItems, handleApply };
};
