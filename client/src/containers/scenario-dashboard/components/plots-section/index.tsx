"use client";

import { useState } from "react";
import { GENERAL_VARIABLES_OPTIONS } from "@/lib/constants/variables-options";
import { PlotGrid } from "@/containers/scenario-dashboard/components/plots-section/plot-grid";
import { TabItem, tabsArray } from "@/containers/scenario-dashboard/components/plots-section/utils";
import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";

export default function PlotsSection() {
  const [selectedTab, setSelectedTab] = useState<TabItem>("general");

  const currentTabVariables =
    tabsArray.find((tab) => tab.name === selectedTab)?.variables || GENERAL_VARIABLES_OPTIONS;

  return (
    <>
      <div className="w-full bg-white pt-8">
        <p className="text-foreground container mx-auto">
          Explore the dashboards below, organised by topic and featuring curated variables
        </p>
      </div>
      <TabsSection selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <PlotGrid variables={currentTabVariables} />
    </>
  );
}
