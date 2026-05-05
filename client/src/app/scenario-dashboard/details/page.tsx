import ScenarioDetailsContainer from "@/containers/scenario-dashboard-container/details-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scenario Details",
};

export default function ScenarioDetailsPage() {
  return <ScenarioDetailsContainer />;
}
