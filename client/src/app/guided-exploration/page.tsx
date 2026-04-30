import { Suspense } from "react";
import { GuidedExplorationPageContainer } from "@/containers/guided-exploration-container";

export default function GuidedExplorationPage() {
  return (
    <Suspense fallback={null}>
      <GuidedExplorationPageContainer />
    </Suspense>
  );
}
