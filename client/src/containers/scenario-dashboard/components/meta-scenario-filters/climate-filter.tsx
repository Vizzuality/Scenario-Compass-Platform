"use client";

import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataFrame } from "@iiasa/ixmp4-ts";
import { useScenarioDashboardUrlParams } from "@/hooks/use-scenario-dashboard-url-params";

interface Props {
  data: DataFrame | undefined;
}

export const ClimateFilter = ({ data }: Props) => {
  const pointsArray = getMetaPoints(data);
  const uniqueValues = [...new Set(pointsArray.map((obj) => obj.value))].sort();
  const { climate, setClimate } = useScenarioDashboardUrlParams();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="climate" className="leading-6 font-bold">
          Climate
        </Label>
        <InfoIcon size={14} />
      </div>
      <Select value={climate || ""} onValueChange={setClimate}>
        <SelectTrigger size="lg" className="w-full" id="climate" theme="light">
          {climate || "Select option"}
        </SelectTrigger>
        <SelectContent>
          {uniqueValues.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
