import { Text } from "@/components/custom/text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ScenarioExplorerCrossLink() {
  return (
    <div
      className={cn(
        "bg-burgundy flex h-full w-full flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        "bg-[length:80%] bg-[position:right_bottom]",
        "sm:bg-[length:60%] sm:bg-[position:right_bottom]",
        "md:bg-[length:50%] md:bg-[position:right_bottom]",
        "lg:bg-[length:90%] lg:bg-[position:right_bottom]",
        "xl:bg-[length:70%] xl:bg-[position:right_bottom]",
        "2xl:bg-[length:45%] 2xl:bg-[position:right_bottom]",
        `bg-[url("/images/illustrations/Illustration_05_cropped_left.webp")]`,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Text as="h2" size="4xl" variant="dark">
          Scenario Explorer
        </Text>
        <Text as="p" size="lg" variant="dark">
          Browse and filter scenarios based on your interests.
        </Text>
      </div>
      <Button
        asChild
        size="lg"
        variant="secondary"
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
