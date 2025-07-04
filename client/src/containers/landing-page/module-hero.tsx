import Link from "next/link";
import heroImg from "@/assets/images/landing-page/il01.png";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";

export function ModuleHero() {
  return (
    <div
      style={{
        backgroundColor: "#652C3B",
        backgroundImage: `url(${heroImg.src})`,
      }}
      className={cn(
        "flex h-fit w-full items-center justify-center overflow-hidden bg-no-repeat",
        styles.heroBackgroundContainer,
      )}
    >
      <div className="container md:grid md:h-fit md:grid-cols-2">
        <div className={"flex flex-col gap-14 px-4 py-12 md:py-20 md:pl-16"}>
          <div className={"flex flex-col gap-6"}>
            <p
              className={
                "text-beige-light font-display text-5xl leading-14 font-bold md:text-7xl md:leading-21 md:font-black"
              }
            >
              Navigate Climate Futures with Data-Driven Scenarios
            </p>
            <p className={"text-beige-light font-sans text-xl leading-7 font-normal not-italic"}>
              Explore, compare, and understand pathways to a sustainable future.
            </p>
          </div>
          <Link
            href={""}
            className={
              "border-beige-light text-beige-light h-13 w-full rounded border-2 px-8 py-4 text-center font-sans text-base leading-5 font-bold not-italic md:w-fit"
            }
          >
            Learn more
          </Link>
        </div>
        <div />
      </div>
    </div>
  );
}
