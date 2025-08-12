import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDetails from "@/containers/scenario-dashboard/scenario-detail/header";
import ScenarioTabs from "@/containers/scenario-dashboard/scenario-detail/sceanario-tabs";

export default function ScenarioDetailContainer() {
  return (
    <div className="w-full bg-white">
      <Navbar theme="light" sheetTheme="white" />
      <ScenarioDetails />
      <ScenarioTabs />
    </div>
  );
}
