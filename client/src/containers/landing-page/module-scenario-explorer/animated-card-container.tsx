import { StaggeredFadeIn } from "@/components/animations/staggered-fade-in";
import { ModuleScenarioExplorerCard } from "@/containers/landing-page/module-scenario-explorer/module-scenario-explorer-card";

const cardData = [
  {
    title: "Explore scenarios",
    description:
      "Filter and compare scenarios across key criteria like warming levels or policy assumptions.",
  },
  {
    title: "Compare scenarios across models",
    description: "Analyze differences between various Integrated Assessment Models (IAMs).",
  },
  {
    title: "View a single scenario in detail",
    description: "Dive deep into individual scenarios' assumptions and outcomes.",
  },
  {
    title: "Regional Insights",
    description: "Select a region to explore it, like its energy and emissions outlook.",
  },
];

export function AnimatedCardContainer() {
  return (
    <div className="w-full lg:w-4/5">
      <StaggeredFadeIn className="flex w-full flex-col gap-8">
        {cardData.map((card, index) => (
          <ModuleScenarioExplorerCard
            key={index}
            title={card.title}
            description={card.description}
          />
        ))}
      </StaggeredFadeIn>
    </div>
  );
}
