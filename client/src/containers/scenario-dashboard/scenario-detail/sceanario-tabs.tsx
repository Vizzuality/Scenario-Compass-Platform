"use client";

import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";
import { useState } from "react";
import { TabItem, tabsArray } from "@/containers/scenario-dashboard/components/plots-section/utils";
import { GENERAL_VARIABLES_OPTIONS } from "@/lib/constants/variables-options";
import { SingleRunPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/single-run-plot-widget";
import { useParams } from "next/navigation";
import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import useSingleRunBatchFilter from "@/hooks/runs/pipeline/use-single-run-batch-filter";

export default function ScenarioTabs() {
  const [selectedTab, setSelectedTab] = useState<TabItem>("general");
  const currentTabVariables =
    tabsArray.find((tab) => tab.name === selectedTab)?.variables || GENERAL_VARIABLES_OPTIONS;
  const params = useParams();
  const runId = params.runId as unknown as number;
  const result = useSingleRunBatchFilter({ variables: currentTabVariables, runId });

  return (
    <div className="bg-background w-full">
      <TabsSection selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className="container mx-auto flex gap-16">
        <div className="container mx-auto my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
          {currentTabVariables.map((variable) => {
            return <SingleRunPlotWidget key={variable} variable={variable} runId={runId} />;
          })}
        </div>
        <SingleRunScenarioFlags result={result} />
      </div>
    </div>
  );
}
