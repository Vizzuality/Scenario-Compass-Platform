import ScenarioDashboardContainer from "@/containers/scenario-dashboard-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scenario Dashboard",
};

export default function ExploreScenarioDashboardPage() {
  return <ScenarioDashboardContainer />;
}
