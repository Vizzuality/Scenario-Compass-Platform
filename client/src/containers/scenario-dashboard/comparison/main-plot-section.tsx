import { PlotRows } from "@/containers/scenario-dashboard/components/plots-section/plot-rows";
import { TabItem, tabsArray } from "@/containers/scenario-dashboard/components/plots-section/utils";
import { GENERAL_VARIABLES_OPTIONS } from "@/lib/constants/variables-options";
import { Button } from "@/components/ui/button";

interface Props {
  selectedTab: TabItem;
}

export default function MainPlotSection({ selectedTab }: Props) {
  const currentTabVariables =
    tabsArray.find((tab) => tab.name === selectedTab)?.variables || GENERAL_VARIABLES_OPTIONS;

  return (
    <div className="container mx-auto my-8 space-y-4">
      <Button>
        <span className="divide-x text-sm font-semibold">Add filter</span>+
      </Button>
      <div className="grid grid-cols-2 gap-0">
        <div className="border-r">
          <PlotRows variables={currentTabVariables} className="pr-6" prefix="left" />
        </div>
        <PlotRows variables={currentTabVariables} className="pl-6" prefix="right" />
      </div>
    </div>
  );
}
