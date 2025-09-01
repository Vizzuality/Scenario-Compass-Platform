import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import MetaIndicatorsFilters from "@/containers/scenario-dashboard/components/meta-scenario-filters";
import ScenarioExplorationPlotsSection from "@/containers/scenario-dashboard/components/plots-section";
import { Suspense } from "react";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard/components/filter-top";
import { Heading } from "@/components/custom/heading";

export default function ScenarioDashboardExploreContainer() {
  return (
    <>
      <ScenarioDashboardHero>
        <Heading
          variant="dark"
          size="5xl"
          as="h1"
          id="hero-title"
          className="container mt-14 mb-16 w-full text-left"
        >
          Scenario Dashboard
        </Heading>
        <ScenarioDashboardTopFilter />
      </ScenarioDashboardHero>
      <Suspense>
        <MetaIndicatorsFilters />
        <ScenarioExplorationPlotsSection />
      </Suspense>
    </>
  );
}
