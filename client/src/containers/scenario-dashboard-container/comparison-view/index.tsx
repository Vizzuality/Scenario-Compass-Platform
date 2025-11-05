"use client";

import { Suspense } from "react";
import { TabsSection } from "@/containers/scenario-dashboard-container/components/plots-section/tabs-section";
import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioComparisonPlotsSection from "@/containers/scenario-dashboard-container/comparison-view/scenario-comparison-plots-section";
import CompareScenariosBackButton from "@/containers/scenario-dashboard-container/components/buttons/compare-scenarios-back-button";

export default function ScenarioDashboardComparisonPageContainer() {
  return (
    <>
      <div className="w-full bg-white">
        <Navbar theme="light" sheetTheme="burgundy" />
        <div className="container mx-auto flex flex-col items-start justify-between gap-11 pt-8">
          <Suspense>
            <CompareScenariosBackButton />
          </Suspense>
          <p className="w-170">
            Use the filters above to compare key data points based on your selected criteria. You
            can also browse the interactive dashboards below, grouped by topic, to explore insights
            in more detail.
          </p>
        </div>
      </div>
      <Suspense>
        <TabsSection />
        <ScenarioComparisonPlotsSection />
      </Suspense>
    </>
  );
}
