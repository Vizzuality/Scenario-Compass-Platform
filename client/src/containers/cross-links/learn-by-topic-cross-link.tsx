import { Text } from "@/components/custom/text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LearnByTopicCrossLink() {
  return (
    <div
      className={cn(
        "bg-beige-light flex flex-col items-center gap-8 bg-no-repeat px-12 pt-20 pb-16",
        "bg-[length:150%] bg-[position:left_bottom_10%]",
        "sm:bg-[length:90%] sm:bg-[position:left_bottom_10%]",
        "md:bg-[length:80%] md:bg-[position:left_bottom_10%]",
        "lg:bg-[length:90%] lg:bg-[position:left_bottom_10%]",
        "xl:bg-[length:90%] xl:bg-[position:left_bottom_10%]",
        "2xl:bg-[length:80%] 2xl:bg-[position:left_bottom_10%]",
        `bg-[url("/images/illustrations/illustration_04_cropped_left.webp")]`,
      )}
    >
      <div className="flex w-full flex-col gap-4 text-center">
        <Text as="h2" size="4xl" variant="light">
          Learn by Topic
        </Text>
        <Text as="p" size="lg" variant="light">
          Dive deep into specific themes and their associated scenarios.
        </Text>
      </div>
      <Button asChild size="lg" variant="default" className="w-full sm:w-fit">
        <Link href="" className="font-sans text-base leading-5 font-bold">
          Go to Learn by Topic
        </Link>
      </Button>
    </div>
  );
}
