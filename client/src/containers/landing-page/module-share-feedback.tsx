import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/custom/text";

export function ModuleShareFeedback() {
  return (
    <section
      className={cn("container grid grid-rows-2 overflow-hidden lg:grid-cols-2 lg:grid-rows-none")}
    >
      <div
        role="img"
        aria-label="Decoration image for the Share Feedback module"
        className={cn(
          "bg-[length:100%] bg-[position:center_top_10vh]",
          "md:bg-[length:70%] md:bg-[position:center_top_-25%]",
          "lg:bg-[length:65%] lg:bg-[position:center_top_25vh]",
          "xl:bg-[length:80%] xl:bg-[position:center_top_15vh]",
          "2xl:bg-[length:70%] 2xl:bg-[position:center_top_10vh]",
          "order-2 bg-no-repeat lg:order-1",
          `bg-[url("/images/ilustrations/ilustration_06.webp")]`,
        )}
      />
      <div className={cn("order-1 w-full px-4 pt-16", "md:px-20 md:py-24 lg:order-2")}>
        <Text as="h2" size="4xl" className="mb-4 text-center lg:text-left">
          Help shape the future of Scenario Compass.
        </Text>
        <Text as="p" size="lg" className="mb-10 text-center lg:text-left">
          Your feedback is invaluable to us! By sharing your thoughts and suggestions, you help us
          improve Scenario Compass. Together, we can build a platform that truly meets your needs.
        </Text>
        <Button variant="outline" size="lg" asChild>
          <Link href={""} className="w-full font-sans text-base leading-5 font-bold md:w-fit">
            Share feedback
          </Link>
        </Button>
      </div>
    </section>
  );
}
