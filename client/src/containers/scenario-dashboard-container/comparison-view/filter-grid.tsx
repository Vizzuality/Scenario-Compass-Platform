import { EnergyFilterRow } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/energy-filter";
import { LandFilterRow } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/land-filter";
import { cn } from "@/lib/utils";
import React from "react";
import { ClimateFilterRow } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/climate-filter/climate-filter-row";

const filterComponents = [ClimateFilterRow, EnergyFilterRow, LandFilterRow];

export const FilterGrid = ({ prefix }: { prefix?: string }) => {
  return (
    <div className="flex flex-col">
      {filterComponents.map((Component, index) => (
        <div
          key={index}
          className={cn("grid grid-cols-2 gap-0 divide-x border-b", index === 0 && "border-t")}
        >
          <div className="py-2">
            <Component />
          </div>
          <div className="py-2 pl-4">
            <Component prefix={prefix} />
          </div>
        </div>
      ))}
    </div>
  );
};
