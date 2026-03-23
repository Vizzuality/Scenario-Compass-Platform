"use client";

import { ClimateFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/climate-filter";
import { EnergyFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/energy-filter";
import { LandFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/land-filter";
import { AdvancedFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/advanced-filter";

export default function MetaIndicatorsFilters() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto grid h-fit w-full grid-cols-2 gap-6 px-4 pt-6 pb-2 sm:px-0 md:flex">
        <ClimateFilter />
        <EnergyFilter />
        <LandFilter />
        <AdvancedFilter />
      </div>
    </div>
  );
}
