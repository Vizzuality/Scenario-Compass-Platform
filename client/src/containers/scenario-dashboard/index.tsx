import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import IntroExplanations from "@/containers/scenario-dashboard/components/intro-explanations";
import { Heading } from "@/components/custom/heading";
import { Suspense } from "react";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard/components/filter-top";
import ExploreScenariosButton from "@/containers/scenario-dashboard/components/buttons/explore-scenarios-button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function ScenarioDashboardContainer() {
  return (
    <>
      <ScenarioDashboardHero>
        <div className="container mt-14 mb-16 flex w-full items-end gap-8">
          <Heading variant="dark" size="5xl" as="h1" id="hero-title" className="text-left">
            Scenario Dashboard
          </Heading>
          <Link
            href={INTERNAL_PATHS.RUN_DASHBOARD_EXPLORATION}
            className="text-beige-light mb-1 flex items-center gap-1"
          >
            <p className="text-base leading-6">See Single Scenario details</p>
            <ChevronRight size={16} />
          </Link>
        </div>
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
