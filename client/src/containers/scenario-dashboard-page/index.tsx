import ScenarioDashboardHero from "@/containers/scenario-dashboard-page/module-hero";
import { GuidedExplorationCrossLink } from "@/containers/cross-links/guided-exploration-cross-link";

export default function ScenarioDashboardContainer() {
  return (
    <main className="flex w-full flex-col items-center">
      <ScenarioDashboardHero />
      <div className="flex w-full justify-center bg-white p-20">
        <GuidedExplorationCrossLink />
      </div>
    </main>
  );
}
