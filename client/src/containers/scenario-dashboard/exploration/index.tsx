import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import DemoFilters from "@/containers/scenario-dashboard/components/demo-filters";
import PlotsSection from "@/containers/scenario-dashboard/components/plots-section";
import { Suspense } from "react";

export default function ScenarioDashboardExploreContainer() {
  return (
    <>
      <ScenarioDashboardHero />
      <Suspense>
        <DemoFilters />
        <PlotsSection />
      </Suspense>
    </>
  );
}
