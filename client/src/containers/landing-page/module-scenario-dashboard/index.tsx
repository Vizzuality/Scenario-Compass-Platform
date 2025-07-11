import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { AnimatedCardContainer } from "@/containers/landing-page/module-scenario-dashboard/animated-card-container";
import { INTERNAL_PATHS } from "@/lib/paths";

export function ModuleScenarioDashboard() {
  return (
    <section
      aria-label="Module Dashboard"
      className={cn(
        "bg-burgundy w-full bg-no-repeat",
        `bg-[url("/images/illustrations/illustration_05_cropped.webp")]`,
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
          <span className="text-background mb-6 text-center text-base leading-6 tracking-[0.64px] uppercase">
            Scenario Dashboard
          </span>
          <Heading as="h2" size="4xl" variant="dark" className="mb-4 text-center">
            Discover the powerful features that drive our platform
          </Heading>
          <p className="text-background text-center text-lg leading-7">
            Browse and filter scenarios based on your interests.
          </p>
        </div>
        <div className="items-center lg:grid lg:grid-cols-2 lg:grid-rows-none lg:gap-0">
          <AnimatedCardContainer />
          <div
            className={cn(
              "mt-12 aspect-[14/10] w-full bg-cover bg-center bg-no-repeat lg:mt-0",
              `bg-[url("/images/landing-page/module-scenario-explorer/mse01.webp")]`,
            )}
          />
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link
            href={INTERNAL_PATHS.SCENARIO_DASHBOARD}
            className="w-full text-base leading-5 font-bold md:w-fit"
          >
            Scenario Dashboard
          </Link>
        </Button>
      </div>
    </section>
  );
}
