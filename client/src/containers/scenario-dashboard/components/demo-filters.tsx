"use client";

import { useEffect, useRef } from "react";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";

const filterArray = ["Climate", "Energy", "Land", "Advanced filters"];

export default function DemoFilters() {
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
      <div className="container mx-auto flex h-fit w-full gap-6 pt-6" ref={filterRef}>
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
