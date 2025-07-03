import Link from "next/link";
import Image from "next/image";
import heroImg from "@/assets/images/landing-page/il01.png";

export function ModuleHero() {
  return (
    <div
      style={{ background: "#652C3B" }}
      className={
        "h-screen overflow-hidden px-4 py-12 md:grid md:h-fit md:grid-cols-2 md:gap-16 md:px-16 md:py-20"
      }
    >
      <div className={"container flex flex-col gap-14"}>
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
      <div className={"relative"}>
        <Image
          src={heroImg}
          alt="hero image"
          className={"origin-top-right object-cover md:scale-160"}
        />
      </div>
    </div>
  );
}
