import { GuidedExplorationCrossLink } from "@/components/cross-links/guided-exploration-cross-link";
import { env } from "@/env";

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
  const isPrelaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;

  return (
    <main className="flex w-full flex-col items-center">
      {children}
      {!isPrelaunch && (
        <div className="flex w-full justify-center bg-white">
          <div className="content-container py-20">
            <GuidedExplorationCrossLink />
          </div>
        </div>
      )}
    </main>
  );
}
