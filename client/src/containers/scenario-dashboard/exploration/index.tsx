import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import DemoFilters from "@/containers/scenario-dashboard/components/demo-filters";
import Playground from "@/containers/scenario-dashboard/components/playground";
import { Suspense } from "react";

export default function ScenarioDashboardExploreContainer() {
  return (
    <>
      <ScenarioDashboardHero />
      <Suspense>
        <DemoFilters />
        <Playground />
      </Suspense>
    </>
  );
}
