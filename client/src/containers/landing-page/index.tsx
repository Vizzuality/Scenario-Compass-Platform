import { ModuleHero } from "@/containers/landing-page/module-hero";
import { ModuleGuidedIntro } from "@/containers/landing-page/guided-intro/module-guided-intro";
import { ModuleLearnByTopic } from "@/containers/landing-page/module-learn-by-topic";
import { ModuleScenarioDashboard } from "@/containers/landing-page/module-scenario-dashboard/module-scenario-dashboard";
import { ModuleShareFeedback } from "@/containers/landing-page/module-share-feedback";
import { ModuleGuidedExploration } from "@/containers/landing-page/module-guided-exploration";

export function LandingPage() {
  return (
    <main className="flex w-full flex-col items-center">
      <ModuleHero />
      <ModuleGuidedIntro />
      <ModuleScenarioDashboard />
      <ModuleLearnByTopic />
      <ModuleGuidedExploration />
      <ModuleShareFeedback />
    </main>
  );
}
