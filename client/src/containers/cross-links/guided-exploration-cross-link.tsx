import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { INTERNAL_PATHS } from "@/lib/paths";

const imgBackgroundStyles = [
  "bg-[length:200%] bg-[position:right_15%_top]",
  "sm:bg-[length:150%] sm:bg-[position:right_25%_top_10%]",
  "md:bg-[length:120%] md:bg-[position:right_30%_top_10%]",
  "lg:bg-[length:140%] lg:bg-[position:right_30%_top_15%]",
  "xl:bg-[length:150%] xl:bg-[position:right_25%_top_15%]",
  "2xl:bg-[length:70%] 2xl:bg-[position:right_35%_top_15%]",
  `bg-[url("/images/illustrations/illustration_02.webp")]`,
];

export function GuidedExplorationCrossLink() {
  return (
    <div
      className={cn(
        "bg-lilac container flex flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        ...imgBackgroundStyles,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Heading as="h2" size="4xl" variant="light">
          Guided Exploration
        </Heading>
        <p className="text-foreground text-lg leading-7">
          Answer critical questions about the interplay between land use, climate goals, and food
          security.
        </p>
      </div>
      <Button asChild size="lg" variant="default" className="w-full sm:w-fit">
        <Link
          href={INTERNAL_PATHS.GUIDED_EXPLORATION}
          className="text-base leading-5 font-bold"
          aria-label="Go to Guided Exploration Page Link"
        >
          Go to Guided Exploration
        </Link>
      </Button>
    </div>
  );
}
