import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Heading } from "@/components/custom/heading";

const imgBackgroundStyles = [
  "bg-[length:200%] bg-[position:left_30%_top]",
  "sm:bg-[length:100%] sm:bg-[position:left_30%_top]",
  "md:bg-[length:100%] md:bg-[position:left_30%_top]",
  "lg:bg-[length:90%] lg:bg-[position:left_30%_top]",
  "xl:bg-[length:80%] xl:bg-[position:left_30%_top]",
  "2xl:bg-[length:70%] 2xl:bg-[position:left_30%_top]",
  `bg-[url("/images/illustrations/Illustration_04_cropped.webp")]`,
];

export function ModuleHero() {
  return (
    <header
      className={cn(
        "flex w-full flex-col items-center overflow-hidden bg-white bg-no-repeat",
        ...imgBackgroundStyles,
      )}
    >
      <Navbar theme="light" sheetTheme="white" />
      <hgroup className="container flex w-full flex-col items-start gap-6 px-10 py-7 md:px-20 md:py-14">
        <Heading variant="light" size="5xl" as="h1">
          Learn by Topic
        </Heading>
        <h2 className="text-foreground text-xl leading-7">
          Dive deep into specific themes and their associated scenarios.{" "}
        </h2>
      </hgroup>
    </header>
  );
}
