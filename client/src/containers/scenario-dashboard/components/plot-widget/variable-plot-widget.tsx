"use client";

import useFilterDataPoints from "@/hooks/use-filter-data-points";
import { LinePlot } from "@/components/plots/line-plot/line-plot";
import { RobustnessIcon } from "@/assets/icons/robustness-icon";
import { ArrowRight, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";
import { AreaPlot } from "@/components/plots/area-plot/area-plot";
import {
  ChartType,
  ChartTypeToggle,
} from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface Props {
  variable: string;
}

export function VariablePlotWidget({ variable }: Props) {
  const { dataPoints } = useFilterDataPoints({ variable });
  const [chartType, setChartType] = useState<ChartType>("line");

  return (
    <div className="aspect-square w-full rounded-md bg-white p-4 select-none">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <RobustnessIcon />
          <p className="leading-5 font-bold text-stone-800">{variable}</p>
        </div>
        <div className="flex items-center gap-4">
          <DownloadIcon className="h-4 w-4" />
          <ChartTypeToggle currentType={chartType} onChange={setChartType} />
        </div>
      </div>
      <div className="mb-5 flex items-center gap-2.5">
        <p className="text-xs">Variable</p>
        <Select>
          <SelectTrigger size="sm">Select an option</SelectTrigger>
        </Select>
      </div>
      {dataPoints && chartType === "line" && <LinePlot dataPoints={dataPoints || []} />}
      {dataPoints && chartType === "area" && <AreaPlot dataPoints={dataPoints || []} />}
      <div className="mt-5 flex w-full justify-end">
        <Button size="sm" variant="outline">
          Learn more <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
