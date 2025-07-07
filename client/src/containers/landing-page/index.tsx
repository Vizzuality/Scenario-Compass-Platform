import { ModuleHero } from "@/containers/landing-page/module-hero";
import { ModuleGuidedIntro } from "@/containers/landing-page/guided-intro/module-guided-intro";
import { ModuleLearnByTopic } from "@/containers/landing-page/module-learn-by-topic";
import { ModuleScenarioExplorer } from "@/containers/landing-page/module-scenario-explorer";
import { ModuleShareFeedback } from "@/containers/landing-page/module-share-feedback";
import { ModuleGuidedExploration } from "@/containers/landing-page/module-guided-exploration";

export function LandingPage() {
  return (
    <main className="flex w-full flex-col items-center">
      <ModuleHero />
      <ModuleGuidedIntro />
      <ModuleScenarioExplorer />
      <ModuleLearnByTopic />
      <ModuleGuidedExploration />
      <ModuleShareFeedback />
    </main>
  );
}
