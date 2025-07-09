import { ModuleHero } from "@/containers/learn-by-topic-page/module-hero";
import { ModuleCrossLinks } from "@/containers/learn-by-topic-page/module-cross-links";

export function LearnByTopicPageContainer() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <ModuleHero />
      <div className="grid min-h-screen place-content-center">Placeholder</div>
      <ModuleCrossLinks />
    </main>
  );
}
