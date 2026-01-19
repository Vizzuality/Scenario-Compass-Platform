import { ModuleHero } from "@/containers/landing-page-container/module-hero";
import { ModuleGuidedIntro } from "@/containers/landing-page-container/guided-intro";
import { ModuleLearnByTopic } from "@/containers/landing-page-container/module-learn-by-topic";
import { ModuleScenarioDashboard } from "@/containers/landing-page-container/module-scenario-dashboard";
import { ModuleShareFeedback } from "@/containers/landing-page-container/module-share-feedback";
import { ModuleGuidedExploration } from "@/containers/landing-page-container/module-guided-exploration";
import { env } from "@/env";
import ComingSoon from "@/containers/coming-soon-container";

export function LandingPage() {
  const isPrelaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;
  const hideForLaunch = true;

  return (
    <main className="flex w-full flex-col items-center">
      <ModuleHero />
      {!isPrelaunch || (hideForLaunch && <ModuleGuidedIntro />)}
      <ModuleScenarioDashboard />
      {isPrelaunch && <ComingSoon />}
      {!env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE ||
        (!isPrelaunch && <ModuleLearnByTopic />)}
      {!isPrelaunch || (hideForLaunch && <ModuleGuidedExploration />)}
      {!isPrelaunch && <ModuleShareFeedback />}
    </main>
  );
}
