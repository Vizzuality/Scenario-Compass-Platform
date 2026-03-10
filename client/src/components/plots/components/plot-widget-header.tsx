import { ChartTypeToggle, ChartType } from "@/components/plots/components/chart-type-toggle";
import DownloadPlotButton, {
  DOWNLOAD_TYPE,
} from "@/components/plots/components/download-plot-button";
import { ExpandChartButton } from "@/components/custom/expand-chart-button";

interface Props {
  chartType?: ChartType;
  onChange?: (chartType: ChartType) => void;
  title?: string;
  onDownload?: (selectedTypes: DOWNLOAD_TYPE[]) => void;
  onExpand?: () => void;
}

export function PlotWidgetHeader({ chartType, onChange, title, onDownload, onExpand }: Props) {
  if (title) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <p className="leading-5 font-bold text-stone-800">{title}</p>
        </div>
        <div className="flex items-center gap-4">
          {onExpand && <ExpandChartButton onClick={onExpand} />}
          <DownloadPlotButton onClick={onDownload} />
          {onChange && <ChartTypeToggle currentType={chartType} onChange={onChange} />}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        {onExpand && <ExpandChartButton onClick={onExpand} />}
        <DownloadPlotButton onClick={onDownload} />
        {onChange && <ChartTypeToggle currentType={chartType} onChange={onChange} />}
      </div>
    </div>
  );
}
