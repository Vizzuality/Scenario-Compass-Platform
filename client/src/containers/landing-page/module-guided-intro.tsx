import img from "@/assets/images/landing-page/guided-intro.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ModuleGuidedIntro() {
  return (
    <div
      className={"container flex flex-col gap-10 px-4 py-16 md:flex-row md:gap-0 lg:px-20 lg:py-28"}
    >
      <div className={"order-2 md:order-1 md:w-1/2"}>
        <p className="pb-6 font-sans text-base leading-6 font-normal text-stone-900 uppercase not-italic">
          Introduction to Scenarios
        </p>
        <p className={"font-display pb-4 text-5xl leading-14 font-bold text-stone-900 not-italic"}>
          What a climate scenario is
        </p>
        <p
          className={
            "w-full pb-14 font-sans text-lg leading-7 font-normal text-stone-700 not-italic md:w-4/5"
          }
        >
          Climate scenarios are plausible representations of the future climate of the Earth, based
          on its current observed state and different greenhouse gas emission scenarios.
        </p>
        <div className="flex flex-col items-center gap-5 md:flex-row">
          <Button size="lg" variant="outline" asChild>
            <Link href={""} className={"order-2 w-full md:order-1 md:w-fit"}>
              Methodology overview
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link href={""} className={"w-full md:w-fit"}>
              Key terminology
            </Link>
          </Button>
        </div>
      </div>
      <div
        className={
          "order-1 w-full rounded-xl bg-white px-8 pt-10 pb-7 shadow-lg md:order-2 md:w-1/2"
        }
      >
        <Image src={img} alt={"img"} />
      </div>
    </div>
  );
}
