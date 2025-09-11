import { DownloadIcon } from "lucide-react";
import { ChartTypeToggle, ChartType } from "@/components/plots/components/chart-type-toggle";
import { Button } from "@/components/ui/button";

interface Props {
  chartType?: ChartType;
  onChange?: (chartType: ChartType) => void;
  title?: string;
  onDownload?: () => void;
}

export function PlotWidgetHeader({ chartType, onChange, title, onDownload }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      {title && (
        <div className="flex gap-2">
          <p className="leading-5 font-bold text-stone-800">{title}</p>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onDownload}>
          <DownloadIcon className="h-4 w-4" />
        </Button>
        {onChange && <ChartTypeToggle currentType={chartType} onChange={onChange} />}
      </div>
    </div>
  );
}
