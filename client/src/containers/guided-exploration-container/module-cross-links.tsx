import { ScenarioDashboardCrossLink } from "@/components/cross-links/scenario-dashboard-cross-link";
import { LearnByTopicCrossLink } from "@/components/cross-links/learn-by-topic-cross-link";

export function ModuleCrossLinks() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <LearnByTopicCrossLink />
      <ScenarioDashboardCrossLink />
    </section>
  );
}
