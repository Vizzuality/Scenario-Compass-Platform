"use client";

import { useEffect, useRef } from "react";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { ClimateFilter } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter";

const filterArray = ["Energy", "Land", "Advanced filters"];

export default function MetaIndicatorsFilters() {
  const filterRef = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      // @ts-expect-error Not sufficient ts support
      key_like: "Climate Assessment|Category [Name]",
    }),
  });

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
        <ClimateFilter data={data} />
        {filterArray.map((filter, index) => (
          <div key={index} className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={"select" + index} className="leading-6 font-bold">
                {filter}
              </Label>
              <InfoIcon size={14} />
            </div>
            <Select>
              <SelectTrigger size="lg" className="w-full" id={"select" + index} theme="light">
                Select option
              </SelectTrigger>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
