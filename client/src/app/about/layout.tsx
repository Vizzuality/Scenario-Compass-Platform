import { GuidedExplorationCrossLink } from "@/components/cross-links/guided-exploration-cross-link";

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-col items-center">
      {children}
      <div className="flex w-full justify-center bg-white p-16 sm:p-20">
        <GuidedExplorationCrossLink />
      </div>
    </main>
  );
}
