"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

const tooltipInfo =
  "Land refers to the use and management of land resources in scenarios, including aspects like deforestation, urbanization, and agricultural practices. This filter allows you to categorize scenarios based on their land use impact.";

const useGetLandOptions = () => {
  const { data } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      // @ts-expect-error Not sufficient ts support
      key_like: "Land Assessment|Category [Name]",
    }),
    select: (data) => getMetaPoints(data),
  });
  return [...new Set(data?.map((obj) => obj.value))].sort();
};

interface LandFilterRowProps {
  prefix?: string;
  onDelete?: () => void;
}

export const LandFilter = () => {
  const uniqueValues = useGetLandOptions();
  const { land, setLand } = useScenarioDashboardUrlParams();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="land" className="leading-6 font-bold">
          Land
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select value={land || ""} onValueChange={setLand}>
        <SelectTrigger size="lg" className="w-full" id="land" theme="light">
          {land || "Select option"}
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

export const LandFilterRow = ({ prefix, onDelete }: LandFilterRowProps) => {
  const uniqueValues = useGetLandOptions();
  const { land, setLand } = useScenarioDashboardUrlParams(prefix);

  return (
    <div className="flex w-full justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor="land" className="w-20 leading-5">
          Land:
        </Label>
        <Select value={land || ""} onValueChange={setLand}>
          <SelectTrigger size="lg" className="w-fit" id="land" theme="light">
            {land || "Select option"}
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
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
