import { CircleCheckBig } from "lucide-react";
import mse01 from "@/assets/images/landing-page/module-scenario-explorer/mse01.png";
import msebgmain from "@/assets/images/landing-page/module-scenario-explorer/msebgmain.png";
import msebgsmall from "@/assets/images/landing-page/module-scenario-explorer/msebgsmall.png";
import styles from "./index.module.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <div className="container mx-auto flex flex-col items-center justify-center gap-18 py-28">
        <div className="px-32">
          <p className="text-beige-light mb-6 text-center font-sans text-base leading-6 font-normal tracking-[0.64px] uppercase">
            Scenario Explorer
          </p>
          <p className="text-beige-light font-display mb-4 text-center text-5xl leading-14 font-bold">
            Discover the powerful features that drive our platform
          </p>
          <p className="text-beige-light text-center font-sans text-lg leading-7 font-normal">
            Browse and filter scenarios based on your interests.
          </p>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex w-4/5 flex-col gap-8">
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
        <Link
          href={""}
          className="border-beige-light text-beige-light flex h-13 items-center justify-center gap-[10px] rounded-sm border-2 px-8 font-sans text-base leading-5 font-bold md:w-fit"
        >
          Scenario Explorer
        </Link>
      </div>
    </div>
  );
}
