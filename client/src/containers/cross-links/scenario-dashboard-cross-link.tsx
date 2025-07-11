import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { INTERNAL_PATHS } from "@/lib/paths";

const imgBackgroundStyles = [
  "bg-[length:80%] bg-[position:right_bottom]",
  "sm:bg-[length:60%] sm:bg-[position:right_bottom]",
  "md:bg-[length:50%] md:bg-[position:right_bottom]",
  "lg:bg-[length:90%] lg:bg-[position:right_bottom]",
  "xl:bg-[length:70%] xl:bg-[position:right_bottom]",
  "2xl:bg-[length:45%] 2xl:bg-[position:right_bottom]",
  `bg-[url("/images/illustrations/Illustration_05_cropped_left.webp")]`,
];

export function ScenarioDashboardCrossLink() {
  return (
    <div
      className={cn(
        "bg-burgundy flex h-full w-full flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        ...imgBackgroundStyles,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Heading as="h2" size="4xl" variant="dark">
          Scenario Dashboard
        </Heading>
        <p className="text-background text-lg leading-7">
          Browse and filter scenarios based on your interests.
        </p>
      </div>
      <Button asChild size="lg" variant="secondary" className="w-full sm:w-fit">
        <Link href={INTERNAL_PATHS.SCENARIO_DASHBOARD} className="text-base leading-5 font-bold">
          Go to Scenario Dashboard
        </Link>
      </Button>
    </div>
  );
}
