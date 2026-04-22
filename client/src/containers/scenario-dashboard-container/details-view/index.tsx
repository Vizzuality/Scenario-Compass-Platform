"use client";

import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDetailsViewHeader from "@/containers/scenario-dashboard-container/details-view/header";
import RunDetailsBody from "@/containers/scenario-dashboard-container/details-view/body";
import { Suspense } from "react";
import ScenarioDetailsSkeleton from "@/containers/scenario-dashboard-container/details-view/skeleton-scenario-details";

export default function ScenarioDetailsContainer() {
  return (
    <div className="w-full bg-white">
      <Suspense fallback={<ScenarioDetailsSkeleton />}>
        <Navbar theme="light" sheetTheme="white" />
        <ScenarioDetailsViewHeader />
        <RunDetailsBody />
      </Suspense>
    </div>
  );
}
