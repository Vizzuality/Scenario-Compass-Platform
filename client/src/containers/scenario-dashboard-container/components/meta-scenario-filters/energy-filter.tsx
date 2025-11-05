"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import { useId } from "react";
import SliderSelect, { ChangeStateAction, SliderSelectItem } from "@/components/slider-select";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";
import { parseRange } from "@/components/slider-select/utils";

const tooltipInfo =
  "Energy refers to the sources and types of energy used in scenarios, such as renewable energy, fossil fuels, or nuclear power. This filter allows you to categorize scenarios based on their energy profiles.";

const useEnergyFilter = (prefix?: string) => {
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
      value: parseRange(fossilShare as string | null),
      defaultRange: [0, 100],
    },
    {
      id: RENEWABLES_SHARE_2050,
      label: "Share of renewables in primary energy in 2050",
      value: parseRange(renewablesShare as string | null),
      defaultRange: [0, 100],
    },
    {
      id: BIOMASS_SHARE_2050,
      label: "Share of biomass in 2050",
      value: parseRange(biomassShare as string | null),
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

export const EnergyFilter = () => {
  const { id, energyItems, handleApply } = useEnergyFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Energy
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <SliderSelect
        id={id}
        items={energyItems}
        placeholder="Select energy type"
        onApply={handleApply}
      />
    </div>
  );
};

export const EnergyFilterRow = ({ prefix }: RowFilterProps) => {
  const { id, energyItems, handleApply } = useEnergyFilter(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Energy:
        </Label>
        <SliderSelect
          id={id}
          className="h-10 w-fit"
          items={energyItems}
          placeholder="Select energy type"
          onApply={handleApply}
        />
      </div>
    </div>
  );
};
