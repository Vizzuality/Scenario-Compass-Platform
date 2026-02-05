import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { FEEDBACK_FORM_LINK } from "@/utils/feedback-link";

const imgBackgroundStyles = [
  "bg-[length:100%] bg-[position:center_top_10vh]",
  "md:bg-[length:70%] md:bg-[position:center_top_-25%]",
  "lg:bg-[length:65%] lg:bg-[position:center_top_25vh]",
  "xl:bg-[length:80%] xl:bg-[position:center_top_15vh]",
  "2xl:bg-[length:70%] 2xl:bg-[position:center_top_10vh]",
  `bg-[url("/images/illustrations/illustration_06.webp")]`,
];

export function ModuleShareFeedback() {
  return (
    <section
      className={cn(
        "container grid h-fit w-full grid-rows-2 overflow-hidden lg:grid-cols-2 lg:grid-rows-none",
      )}
    >
      <div
        role="img"
        aria-label="Decoration image for the Share Feedback module"
        className={cn("order-2 bg-no-repeat lg:order-1", ...imgBackgroundStyles)}
      />
      <div className={cn("order-1 w-full px-4 pt-16", "md:px-20 md:py-24 lg:order-2")}>
        <Heading as="h2" size="4xl" className="mb-4 text-center lg:text-left">
          Help shape the future of Scenario Compass.
        </Heading>
        <p className="mb-10 text-center text-lg leading-7 lg:text-left">
          Your feedback is invaluable to us! <br />
          By sharing your thoughts and suggestions, you help us improve Scenario Compass. Together,
          we can build a platform that truly meets your needs.
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link
            rel="noopener noreferrer"
            href={FEEDBACK_FORM_LINK}
            target="_blank"
            aria-label="Provide feedback about this page"
            className="w-full text-base leading-5 font-bold md:w-fit"
          >
            Share feedback
          </Link>
        </Button>
      </div>
    </section>
  );
}
