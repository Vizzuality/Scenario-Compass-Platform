"use client";

import { useEffect, useRef } from "react";
import { ClimateFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/climate-filter";
import { EnergyFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/energy-filter";
import { LandFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/land-filter";
import { AdvancedFilter } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/advanced-filter";

export default function MetaIndicatorsFilters() {
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto flex h-fit w-full gap-6 pt-6 pb-2" ref={filterRef}>
        <ClimateFilter />
        <EnergyFilter />
        <LandFilter />
        <AdvancedFilter />
      </div>
    </div>
  );
}
