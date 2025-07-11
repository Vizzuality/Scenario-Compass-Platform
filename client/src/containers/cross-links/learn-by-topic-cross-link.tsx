import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { INTERNAL_PATHS } from "@/lib/paths";

const imgBackgroundStyles = [
  "bg-[length:150%] bg-[position:left_bottom_10%]",
  "sm:bg-[length:90%] sm:bg-[position:left_bottom_10%]",
  "md:bg-[length:80%] md:bg-[position:left_bottom_10%]",
  "lg:bg-[length:90%] lg:bg-[position:left_bottom_10%]",
  "xl:bg-[length:90%] xl:bg-[position:left_bottom_10%]",
  "2xl:bg-[length:80%] 2xl:bg-[position:left_bottom_10%]",
  `bg-[url("/images/illustrations/illustration_04_cropped_left.webp")]`,
];

export function LearnByTopicCrossLink() {
  return (
    <div
      className={cn(
        "bg-beige-light flex flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        ...imgBackgroundStyles,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Heading as="h2" size="4xl" variant="light">
          Learn by Topic
        </Heading>
        <p className="text-foreground text-lg leading-7">
          Dive deep into specific themes and their associated scenarios.
        </p>
      </div>
      <Button asChild size="lg" variant="default" className="w-full sm:w-fit">
        <Link href={INTERNAL_PATHS.LEARN_BY_TOPIC} className="text-base leading-5 font-bold">
          Go to Learn by Topic
        </Link>
      </Button>
    </div>
  );
}
