import Link from "next/link";
import heroImg from "@/assets/images/ilustrations/ilustration_01.png";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Subtitle, Title } from "@/components/custom/typography";

export function ModuleHero() {
  return (
    <div className="bg-burgundy w-full">
      <Navbar theme="dark" sheetTheme="burgundy" />
      <div
        style={{
          backgroundImage: `url(${heroImg.src})`,
        }}
        className={cn(
          "flex h-fit w-full items-center justify-center overflow-hidden bg-no-repeat",
          styles.heroBackgroundContainer,
        )}
      >
        <div className="md;pb-0 container pb-16 md:grid md:h-fit md:grid-cols-2">
          <div className={"flex flex-col gap-16 px-4 py-12 md:gap-14 md:py-20 md:pl-16"}>
            <div className={"flex flex-col gap-6"}>
              <Title variant="light">Navigate Climate Futures with Data-Driven Scenarios</Title>
              <Subtitle variant="light">
                Explore, compare, and understand pathways to a sustainable future.
              </Subtitle>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href={""} className={"w-full md:w-fit"}>
                Learn more
              </Link>
            </Button>
          </div>
          <div className={"h-20 md:h-full"} />
        </div>
      </div>
    </div>
  );
}
