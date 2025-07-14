import { GuidedExplorationCrossLink } from "@/containers/cross-links/guided-exploration-cross-link";

export default function ScenarioDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center">
      {children}
      <div className="flex w-full justify-center bg-white p-20">
        <GuidedExplorationCrossLink />
      </div>
    </main>
  );
}
