import { GuidedExplorationCrossLink } from "@/components/cross-links/guided-exploration-cross-link";
import { ScenarioDashboardCrossLink } from "@/components/cross-links/scenario-dashboard-cross-link";

export function ModuleCrossLinks() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <GuidedExplorationCrossLink />
      <ScenarioDashboardCrossLink />
    </section>
  );
}
