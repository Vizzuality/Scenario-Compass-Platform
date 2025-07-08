import Link from "next/link";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/custom/text";

export function ModuleHero() {
  return (
    <header className="bg-burgundy w-full">
      <Navbar theme="dark" sheetTheme="burgundy" />
      <div
        aria-label="Hero section with a background image and text"
        className={cn(
          "flex h-fit w-full items-center justify-center overflow-hidden bg-no-repeat",
          "bg-[length:200%] bg-[position:right_15%_top_40vh]",
          "md:bg-[length:100%] md:bg-[position:center_top_17vh]",
          "lg:bg-[length:90%] lg:bg-[position:center_top_10vh]",
          "xl:bg-[length:80%] xl:bg-[position:right_15%_bottom_160%]",
          "2xl:bg-[length:65%] 2xl:bg-[position:right_15%_bottom_100%]",
          `bg-[url("/images/ilustrations/ilustration_01.webp")]`,
        )}
      >
        <div className="container pb-16 lg:grid lg:h-fit lg:grid-cols-2 lg:pb-0">
          <div className={"flex flex-col gap-16 px-4 py-12 md:gap-14 md:py-20 md:pl-16"}>
            <div className={"flex flex-col gap-6"}>
              <Text variant="dark" size="5xl" as="h1">
                Navigate Climate Futures with Data-Driven Scenarios
              </Text>
              <Text as="h2" size="xl" variant="dark">
                Explore, compare, and understand pathways to a sustainable future.
              </Text>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link
                href={""}
                className={"w-full font-sans text-base leading-5 font-bold md:w-fit"}
                aria-label="Learn more about the platform"
              >
                Learn more
              </Link>
            </Button>
          </div>
          <div className={"h-20 md:h-full"} />
        </div>
      </div>
    </header>
  );
}
