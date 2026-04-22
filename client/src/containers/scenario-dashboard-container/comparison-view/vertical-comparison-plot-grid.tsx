import { TabConfig } from "@/lib/config/tabs/tabs-config";
import { ComparisonPlotPair } from "@/containers/scenario-dashboard-container/components/comparison-plot-pair";
import { ComparisonPlotSide } from "@/containers/scenario-dashboard-container/components/comparison-plot-side";

export const VerticalComparisonPlotGrid = ({
  selectedTab,
  prefix,
}: {
  selectedTab: TabConfig;
  prefix: string;
}) => {
  if (selectedTab.isCustom) {
    return (
      <div className="-my-6 grid grid-cols-2 gap-0">
        <ComparisonPlotSide isCustom className="border-r py-6 pr-4" />
        <ComparisonPlotSide isCustom prefix={prefix} className="py-6 pl-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-6">
      {selectedTab.explorationPlotConfigArray.map((plotConfig) => (
        <ComparisonPlotPair
          key={plotConfig.title}
          plotConfig={plotConfig}
          prefix={prefix}
          plotConfigArray={selectedTab.explorationPlotConfigArray}
        />
      ))}
    </div>
  );
};
