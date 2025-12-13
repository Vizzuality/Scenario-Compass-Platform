import ScenarioDashboardHero from "@/containers/scenario-dashboard-container/components/module-hero";
import MetaIndicatorsFilters from "@/containers/scenario-dashboard-container/components/meta-scenario-filters";
import ScenarioExplorationPlotsSection from "@/containers/scenario-dashboard-container/components/plots-section";
import { Suspense } from "react";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard-container/components/filter-top";
import { Heading } from "@/components/custom/heading";
import { INTERNAL_PATHS } from "@/lib/paths";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import MetaIndicatorsFilterSkeleton from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/skeletons/meta-indicators-filter-skeleton";

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
        <ScenarioDashboardTopFilter />
      </ScenarioDashboardHero>
      <Suspense fallback={<MetaIndicatorsFilterSkeleton />}>
        <MetaIndicatorsFilters />
      </Suspense>
      <ScenarioExplorationPlotsSection />
    </>
  );
}
