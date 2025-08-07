"use client";

import { Suspense, useState } from "react";
import { TabItem } from "@/containers/scenario-dashboard/components/plots-section/utils";
import { TabsSection } from "@/containers/scenario-dashboard/components/plots-section/tabs-section";
import { Navbar } from "@/components/layout/navbar/navbar";
import MainPlotSection from "@/containers/scenario-dashboard/comparison/main-plot-section";
import CompareScenariosBackButton from "@/containers/scenario-dashboard/components/buttons/compare-scenarios-back-button";

export default function ScenarioDashboardComparisonPageContainer() {
  const [selectedTab, setSelectedTab] = useState<TabItem>("general");

  return (
    <>
      <div className="w-full bg-white">
        <Navbar theme="light" sheetTheme="burgundy" />
        <div className="container mx-auto flex flex-col items-start justify-between gap-11 pt-8">
          <Suspense>
            <CompareScenariosBackButton />
          </Suspense>
          <p>
            Use the filters above to compare key data points based on your selected criteria. You
            can also browse the interactive dashboards below, grouped by topic, to explore insights
            in more detail.
          </p>
        </div>
      </div>
      <TabsSection selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <Suspense>
        <MainPlotSection selectedTab={selectedTab} />
      </Suspense>
    </>
  );
}
