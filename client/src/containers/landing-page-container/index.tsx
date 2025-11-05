import { ModuleHero } from "@/containers/landing-page-container/module-hero";
import { ModuleGuidedIntro } from "@/containers/landing-page-container/guided-intro";
import { ModuleLearnByTopic } from "@/containers/landing-page-container/module-learn-by-topic";
import { ModuleScenarioDashboard } from "@/containers/landing-page-container/module-scenario-dashboard";
import { ModuleShareFeedback } from "@/containers/landing-page-container/module-share-feedback";
import { ModuleGuidedExploration } from "@/containers/landing-page-container/module-guided-exploration";
import { env } from "@/env";

export function LandingPage() {
  return (
    <main className="flex w-full flex-col items-center">
      <ModuleHero />
      <ModuleGuidedIntro />
      <ModuleScenarioDashboard />
      {!env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE && <ModuleLearnByTopic />}
      <ModuleGuidedExploration />
      <ModuleShareFeedback />
    </main>
  );
}
