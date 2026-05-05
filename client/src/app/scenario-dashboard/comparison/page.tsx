import ScenarioDashboardComparisonPageContainer from "@/containers/scenario-dashboard-container/comparison-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparison",
};

export default function ScenarioDashboardComparisonPage() {
  return <ScenarioDashboardComparisonPageContainer />;
}
