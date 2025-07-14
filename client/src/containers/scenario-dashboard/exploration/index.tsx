import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import DemoFilters from "@/containers/scenario-dashboard/components/demo-filters";
import Playground from "@/containers/scenario-dashboard/components/playground";
import { Suspense } from "react";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard/components/filter-top";
import { Button } from "@/components/ui/button";

export default function ScenarioDashboardExploreContainer() {
  return (
    <>
      <ScenarioDashboardHero>
        <Suspense>
          <ScenarioDashboardTopFilter>
            <Button
              size="lg"
              className="w-full flex-1 text-base leading-5"
              variant="tertiary"
              disabled
              aria-current="page"
            >
              Explore Scenarios
            </Button>
          </ScenarioDashboardTopFilter>
        </Suspense>
      </ScenarioDashboardHero>
      <Suspense>
        <DemoFilters />
        <Playground />
      </Suspense>
    </>
  );
}
