import { RobustnessIcon } from "@/assets/icons/robustness-icon";
import { DownloadIcon } from "lucide-react";
import {
  ChartTypeToggle,
  ChartType,
} from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface Props {
  chartType: ChartType;
  onChange?: (chartType: ChartType) => void;
  variable: string;
}

export function VariablePlotWidgetHeader({ chartType, onChange, variable }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex gap-2">
        <RobustnessIcon />
        <p className="leading-5 font-bold text-stone-800">{variable}</p>
      </div>
      <div className="flex items-center gap-4">
        <DownloadIcon className="h-4 w-4" />
        {onChange && <ChartTypeToggle currentType={chartType} onChange={onChange} />}
      </div>
    </div>
  );
}
