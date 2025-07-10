import { ModuleHero } from "@/containers/learn-by-topic-page/module-hero";
import { ModuleCrossLinks } from "@/containers/learn-by-topic-page/module-cross-links";

export function LearnByTopicPageContainer() {
  return (
    <>
      <ModuleHero />
      <div className="grid min-h-screen place-content-center" />
      <ModuleCrossLinks />
    </>
  );
}
