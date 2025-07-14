import { Navbar } from "@/components/layout/navbar/navbar";
import ScenarioDashboardTopFilter from "@/containers/scenario-dashboard-page/filter-top";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const imgBackgroundStyles = [
  "bg-[length:80%] bg-[position:right_bottom]",
  "sm:bg-[length:60%] sm:bg-[position:right_bottom]",
  "md:bg-[length:50%] md:bg-[position:right_bottom]",
  "lg:bg-[length:90%] lg:bg-[position:right_bottom_60%]",
  "xl:bg-[length:25%] xl:bg-[position:right_bottom]",
  "2xl:bg-[length:25%] 2xl:bg-[position:right_bottom]",
  `bg-[url("/images/illustrations/Illustration_05_cropped_left.webp")]`,
];

export default function ScenarioDashboardHero() {
  return (
    <div
      className={cn(
        "bg-burgundy flex h-full w-full flex-col items-center justify-center bg-no-repeat",
        ...imgBackgroundStyles,
      )}
    >
      <Navbar theme="dark" sheetTheme="burgundy" />
      <div className="container mb-6 w-full">
        <Suspense fallback={null}>
          <ScenarioDashboardTopFilter />
        </Suspense>
      </div>
    </div>
  );
}
