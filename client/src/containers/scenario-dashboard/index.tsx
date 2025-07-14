import ScenarioDashboardHero from "@/containers/scenario-dashboard/components/module-hero";
import IntroExplanations from "@/containers/scenario-dashboard/components/intro-explanations";

export default function ScenarioDashboardContainer() {
  return (
    <>
      <ScenarioDashboardHero showHeading />
      <IntroExplanations />
    </>
  );
}
