import { ScenarioDashboardCrossLink } from "@/components/cross-links/scenario-dashboard-cross-link";

export default function LicensePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center">
      {children}
      <div className="flex w-full justify-center bg-white">
        <div className="content-container py-20">
          <ScenarioDashboardCrossLink />
        </div>
      </div>
    </main>
  );
}
