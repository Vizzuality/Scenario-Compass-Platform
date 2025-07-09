import { Text } from "@/components/custom/text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function GuidedExplorationCrossLink() {
  return (
    <div
      className={cn(
        "bg-lilac flex flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        "bg-[length:200%] bg-[position:right_15%_top]",
        "sm:bg-[length:150%] sm:bg-[position:right_25%_top_10%]",
        "md:bg-[length:120%] md:bg-[position:right_30%_top_10%]",
        "lg:bg-[length:140%] lg:bg-[position:right_30%_top_15%]",
        "xl:bg-[length:150%] xl:bg-[position:right_25%_top_15%]",
        "2xl:bg-[length:130%] 2xl:bg-[position:right_35%_top_15%]",
        `bg-[url("/images/illustrations/illustration_02.webp")]`,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Text as="h2" size="4xl" variant="light">
          Guided Exploration
        </Text>
        <Text as="p" size="lg" variant="light">
          Answer critical questions about the interplay between land use, climate goals, and food
          security.
        </Text>
      </div>
      <Button
        asChild
        size="lg"
        variant="default"
        className="w-full sm:w-fit"
        aria-label="Button to open key terminology list of terms and definitions"
      >
        <Link href="" className="font-sans text-base leading-5 font-bold">
          Go to Guided Exploration
        </Link>
      </Button>
    </div>
  );
}
