import { ModuleHero } from "@/containers/landing-page/module-hero";
import { ModuleGuidedIntro } from "@/containers/landing-page/module-guided-intro";
import { ModuleLearnByTopic } from "@/containers/landing-page/module-learn-by-topic";
import { ModuleScenarioExplorer } from "@/containers/landing-page/module-scenario-explorer";
import { ModuleShareFeedback } from "@/containers/landing-page/module-share-feedback";
import { ModuleGuidedExploration } from "@/containers/landing-page/module-guided-exploration";

export function LandingPage() {
  return (
    <>
      <ModuleHero />
      <ModuleGuidedIntro />
      <ModuleGuidedExploration />
      <ModuleLearnByTopic />
      <ModuleScenarioExplorer />
      <ModuleShareFeedback />
    </>
  );
}
