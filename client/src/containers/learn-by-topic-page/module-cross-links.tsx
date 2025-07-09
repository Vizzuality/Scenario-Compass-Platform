import { GuidedExplorationCrossLink } from "@/containers/cross-links/guided-exploration-cross-link";
import { ScenarioExplorerCrossLink } from "@/containers/cross-links/scenario-explorer-cross-link";

export function ModuleCrossLinks() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <GuidedExplorationCrossLink />
      <ScenarioExplorerCrossLink />
    </section>
  );
}
