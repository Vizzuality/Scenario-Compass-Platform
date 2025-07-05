import { CircleCheckBig } from "lucide-react";
import mse01 from "@/assets/images/landing-page/module-scenario-explorer/mse01.png";
import msebgmain from "@/assets/images/landing-page/module-scenario-explorer/msebgmain.png";
import msebgsmall from "@/assets/images/landing-page/module-scenario-explorer/msebgsmall.png";
import styles from "./index.module.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnteTitle, BodyText, Title2 } from "@/components/custom/typography";

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="bg-burgundy-dark h-fit w-fit rounded-full p-4">
        <CircleCheckBig className="h-8 w-8 text-green-400" />
      </div>
      <div className="flex flex-col">
        <p className="text-beige-light font-sans text-xl leading-7 font-bold">{title}</p>
        <p className="text-burgundy-light font-sans text-lg leading-7 font-normal">{description}</p>
      </div>
    </div>
  );
}

export function ModuleScenarioExplorer() {
  return (
    <div
      className="bg-burgundy w-full bg-[length:60%] bg-[position:right_bottom] bg-no-repeat"
      style={{
        backgroundImage: `url(${mse01.src})`,
      }}
    >
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 pt-16 pb-32 md:gap-18 md:pt-28 md:pb-28">
        <div className="flex flex-col md:px-32">
          <AnteTitle variant="light" className="mb-6 text-center">
            Scenario Explorer
          </AnteTitle>
          <Title2 variant="light" className="mb-4 text-center">
            Discover the powerful features that drive our platform
          </Title2>
          <BodyText variant="light" className="text-center">
            Browse and filter scenarios based on your interests.
          </BodyText>
        </div>
        <div className="gap grid grid-rows-2 gap-12 md:grid-cols-2 md:gap-0">
          <div className="flex w-full flex-col gap-8 md:w-4/5">
            <Card
              title={"Explore scenarios"}
              description={
                "Filter and compare scenarios across key criteria like warming levels or policy assumptions."
              }
            />
            <Card
              title={"Compare scenarios across models"}
              description={
                "Analyze differences between various Integrated Assessment Models (IAMs)."
              }
            />
            <Card
              title={"View a single scenario in detail"}
              description={"Dive deep into individual scenarios' assumptions and outcomes."}
            />
            <Card
              title={"Regional Insights"}
              description={"Select a region to explore it, like its energy and emissions outlook."}
            />
          </div>
          <div
            className={cn("bg-beige-light rounded-xl shadow-lg", styles.scenarioExplorerContainer)}
            style={{
              backgroundImage: `url(${msebgsmall.src}), url(${msebgmain.src})`,
            }}
          />
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href={""} className="w-full md:w-fit">
            Scenario Explorer
          </Link>
        </Button>
      </div>
    </div>
  );
}
