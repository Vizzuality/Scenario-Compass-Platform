import { GuidedExplorationCrossLink } from "@/components/cross-links/guided-exploration-cross-link";

export default function MethodologyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center">
      {children}
      <div className="flex w-full justify-center bg-white">
        <div className="content-container py-20">
          <GuidedExplorationCrossLink />
        </div>
      </div>
    </main>
  );
}
