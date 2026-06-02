import { ScenarioDashboardCrossLink } from "@/components/cross-links/scenario-dashboard-cross-link";

export default function GuidedExplorationPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="flex w-full justify-center bg-white">
        <div className="content-container py-20">
          <ScenarioDashboardCrossLink />
        </div>
      </div>
    </>
  );
}
