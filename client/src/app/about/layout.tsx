import { env } from "@/env";
import { ScenarioDashboardCrossLink } from "@/components/cross-links/scenario-dashboard-cross-link";

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
  const isPrelaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;

  return (
    <main className="flex w-full flex-col items-center">
      {children}
      {!isPrelaunch && (
        <div className="flex w-full justify-center bg-white">
          <div className="content-container py-20">
            <ScenarioDashboardCrossLink />
          </div>
        </div>
      )}
    </main>
  );
}
