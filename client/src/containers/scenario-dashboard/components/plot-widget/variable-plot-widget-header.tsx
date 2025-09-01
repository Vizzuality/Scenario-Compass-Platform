import { DownloadIcon } from "lucide-react";
import {
  ChartTypeToggle,
  ChartType,
} from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface Props {
  chartType: ChartType;
  onChange?: (chartType: ChartType) => void;
  title: string;
}

export function VariablePlotWidgetHeader({ chartType, onChange, title }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex gap-2">
        <p className="leading-5 font-bold text-stone-800">{title}</p>
      </div>
      <div className="flex items-center gap-4">
        <DownloadIcon className="h-4 w-4" />
        {onChange && <ChartTypeToggle currentType={chartType} onChange={onChange} />}
      </div>
    </div>
  );
}
