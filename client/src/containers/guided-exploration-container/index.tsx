import { ModuleHero } from "@/containers/guided-exploration-container/module-hero";
import { ModuleCrossLinks } from "@/containers/guided-exploration-container/module-cross-links";
import { env } from "@/env";

export function GuidedExplorationPageContainer() {
  return (
    <>
      <ModuleHero />
      <div className="grid min-h-screen place-content-center" />
      <div className="h-28 w-full bg-white" />
      {!env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE && <ModuleCrossLinks />}
    </>
  );
}
