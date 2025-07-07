import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/custom/text";

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="bg-burgundy-dark h-fit w-fit rounded-full p-4">
        <CircleCheckBig className="h-8 w-8 text-green-400" />
      </div>
      <div className="flex flex-col">
        <Text as="h3" size="xl" variant="dark" className="font-bold">
          {title}
        </Text>
        <p className="text-burgundy-light font-sans text-lg leading-7 font-normal">{description}</p>
      </div>
    </div>
  );
}

export function ModuleScenarioExplorer() {
  return (
    <div
      className={cn(
        "bg-burgundy w-full bg-no-repeat",
        `bg-[url("/assets/images/ilustrations/ilustration_05_cropped.webp")]`,
        "bg-[length:140%]",
        "bg-[position:right_30%_bottom_-4%]",
        "md:bg-[length:60%]",
        "md:bg-[position:right_bottom]",
        "lg:bg-[length:50%]",
        "lg:bg-[position:right_bottom]",
        "xl:bg-[length:50%]",
        "xl:bg-[position:right_bottom]",
        "2xl:bg-[length:40%]",
        "2xl:bg-[position:right_bottom]",
      )}
    >
      <div
        className={cn(
          "container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16",
          "lg:gap-18 lg:px-20 lg:py-28",
          "md:gap-8 md:px-10 md:py-14",
        )}
      >
        <div className="flex flex-col lg:px-32">
          <Text as="span" size="base" variant="dark" className="mb-6 text-center">
            Scenario Explorer
          </Text>
          <Text as="h2" size="4xl" variant="dark" className="mb-4 text-center">
            Discover the powerful features that drive our platform
          </Text>
          <Text as="p" size="lg" variant="dark" className="text-center">
            Browse and filter scenarios based on your interests.
          </Text>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:grid-rows-none lg:gap-0">
          <div className="flex w-full flex-col gap-8 lg:w-4/5">
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
            className={cn(
              "bg-beige-light mt-12 h-[calc(60vw)] rounded-xl shadow-lg md:h-[calc(50vw)] lg:mt-0 lg:h-full",
              "bg-[length:80%]",
              "bg-[position:bottom_right_10%]",
              "bg-no-repeat",
              "md:bg-[length:70%]",
              "md:bg-[position:bottom_center]",
              "lg:bg-[length:80%]",
              "lg:bg-[position:center_center]",
              "xl:bg-[length:90%]",
              "xl:bg-[position:bottom_center]",
              "2xl:bg-[length:80%]",
              "2xl:bg-[position:bottom_center]",
              `bg-[url("/assets/images/landing-page/module-scenario-explorer/mse01.png")]`,
            )}
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
