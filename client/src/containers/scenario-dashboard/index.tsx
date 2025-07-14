import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import IntroExplanations from "@/containers/scenario-dashboard/components/intro-explanations";
import { Heading } from "@/components/custom/heading";
import { Suspense } from "react";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard/components/filter-top";
import ExploreScenariosButton from "@/containers/scenario-dashboard/components/explore-scenarios-button";

export default function ScenarioDashboardContainer() {
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
        <Suspense>
          <ScenarioDashboardTopFilter>
            <ExploreScenariosButton />
          </ScenarioDashboardTopFilter>
        </Suspense>
      </ScenarioDashboardHero>
      <IntroExplanations />
    </>
  );
}
