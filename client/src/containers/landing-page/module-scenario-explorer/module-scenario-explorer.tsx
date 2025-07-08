import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/custom/text";
import { AnimatedCardContainer } from "@/containers/landing-page/module-scenario-explorer/animated-card-container";

export function ModuleScenarioExplorer() {
  return (
    <section
      aria-label="Module Scenario Explorer"
      className={cn(
        "bg-burgundy w-full bg-no-repeat",
        `bg-[url("/images/ilustrations/ilustration_05_cropped.webp")]`,
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
        <div className="items-center lg:grid lg:grid-cols-2 lg:grid-rows-none lg:gap-0">
          <AnimatedCardContainer />
          <div
            className={cn(
              "mt-12 aspect-[14/10] w-full bg-cover bg-center bg-no-repeat lg:mt-0",
              `bg-[url("/images/landing-page/module-scenario-explorer/mse01.png")]`,
            )}
          />
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href={""} className="w-full font-sans text-base leading-5 font-bold md:w-fit">
            Scenario Explorer
          </Link>
        </Button>
      </div>
    </section>
  );
}
