import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard/components/filter-top";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Heading } from "@/components/custom/heading";

const imgBackgroundStyles = [
  "bg-[length:80%] bg-[position:right_bottom]",
  "sm:bg-[length:60%] sm:bg-[position:right_bottom]",
  "md:bg-[length:50%] md:bg-[position:right_bottom]",
  "lg:bg-[length:90%] lg:bg-[position:right_bottom_60%]",
  "xl:bg-[length:25%] xl:bg-[position:right_bottom]",
  "2xl:bg-[length:25%] 2xl:bg-[position:right_bottom]",
  `bg-[url("/images/illustrations/Illustration_05_cropped_left.webp")]`,
];

export default function ScenarioDashboardHero({ showHeading = false }: { showHeading?: boolean }) {
  return (
    <div
      className={cn(
        "bg-burgundy flex h-full w-full flex-col items-center justify-center bg-no-repeat",
        ...imgBackgroundStyles,
      )}
    >
      <Navbar theme="dark" sheetTheme="burgundy" />
      {showHeading && (
        <Heading
          variant="dark"
          size="5xl"
          as="h1"
          id="hero-title"
          className="container mt-14 mb-16 w-full text-left"
        >
          Scenario Dashboard
        </Heading>
      )}
      <div className="container mb-6 w-full">
        <Suspense>
          <ScenarioDashboardTopFilter />
        </Suspense>
      </div>
    </div>
  );
}
