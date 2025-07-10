import { GuidedExplorationCrossLink } from "@/containers/cross-links/guided-exploration-cross-link";
import { ScenarioDashboardCrossLink } from "@/containers/cross-links/scenario-dashboard-cross-link";

export function ModuleCrossLinks() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <GuidedExplorationCrossLink />
      <ScenarioDashboardCrossLink />
    </section>
  );
}
