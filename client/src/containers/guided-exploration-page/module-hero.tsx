import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Text } from "@/components/custom/text";

export function ModuleHero() {
  return (
    <header
      className={cn(
        "bg-lilac flex w-full flex-col items-center overflow-hidden bg-no-repeat",
        "bg-[length:180%] bg-[position:bottom_120%_right]",
        "sm:bg-[length:160%] sm:bg-[position:bottom_120%_right]",
        "md:bg-[length:150%] md:bg-[position:bottom_120%_right]",
        "lg:bg-[length:80%] lg:bg-[position:bottom_250%_right]",
        "xl:bg-[length:75%] xl:bg-[position:right_bottom_140%]",
        "2xl:bg-[length:70%] 2xl:bg-[position:right_bottom_100%]",
        `bg-[url("/images/illustrations/Illustration_02_horizontal.webp")]`,
      )}
    >
      <Navbar theme="light" sheetTheme="lilac" />
      <div className="container grid-cols-2 px-10 py-7 md:px-20 md:py-14 lg:grid">
        <div className="flex flex-col gap-6">
          <Text variant="light" size="5xl" as="h1">
            Guided Exploration
          </Text>
          <Text as="h2" size="xl" variant="light">
            Answer critical questions about the interplay between land use, climate goals, and food
            security.
          </Text>
        </div>
      </div>
    </header>
  );
}
