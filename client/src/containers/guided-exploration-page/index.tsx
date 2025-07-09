import { ModuleHero } from "@/containers/guided-exploration-page/module-hero";
import { ModuleCrossLinks } from "@/containers/guided-exploration-page/module-cross-links";

export function GuidedExplorationPageContainer() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <ModuleHero />
      <div className="grid min-h-screen place-content-center">Placeholder</div>
      <div className="h-28 w-full bg-white" />
      <ModuleCrossLinks />
    </main>
  );
}
