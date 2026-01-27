import { GuidedExplorationCrossLink } from "@/components/cross-links/guided-exploration-cross-link";
import { EmbargoPopUp } from "@/components/custom/embargo-pop-up";

export default function ScenarioDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center">
      <EmbargoPopUp />
      {children}
      <div className="flex w-full justify-center bg-white p-16 sm:p-20">
        <GuidedExplorationCrossLink />
      </div>
    </main>
  );
}
