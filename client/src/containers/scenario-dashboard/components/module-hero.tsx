import { Navbar } from "@/components/layout/navbar/navbar";
import { cn } from "@/lib/utils";

const imgBackgroundStyles = [
  "bg-[length:80%] bg-[position:right_bottom]",
  "sm:bg-[length:60%] sm:bg-[position:right_bottom]",
  "md:bg-[length:50%] md:bg-[position:right_bottom]",
  "lg:bg-[length:90%] lg:bg-[position:right_bottom_60%]",
  "xl:bg-[length:40%] xl:bg-[position:right_bottom_160%]",
  "2xl:bg-[length:40%] 2xl:bg-[position:right_bottom_100%]",
  `lg:bg-[url("/images/illustrations/Illustration_05_cropped_left.webp")]`,
];

interface Props {
  children: React.ReactNode;
}

export default function ScenarioDashboardHero({ children }: Props) {
  return (
    <div
      className={cn(
        "bg-burgundy flex h-full w-full flex-col items-center justify-center bg-no-repeat",
        ...imgBackgroundStyles,
      )}
    >
      <Navbar theme="dark" sheetTheme="burgundy" />
      {children}
    </div>
  );
}
