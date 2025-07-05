import img from "@/assets/images/landing-page/guided-intro.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnteTitle, BodyText, Title2 } from "@/components/custom/typography";

export function ModuleGuidedIntro() {
  return (
    <div
      className={"container flex flex-col gap-10 px-4 py-16 md:flex-row md:gap-0 lg:px-20 lg:py-28"}
    >
      <div className={"order-2 flex flex-col gap-14 md:order-1 md:w-1/2"}>
        <div className="flex flex-col">
          <AnteTitle className="mb-6">Introduction to Scenarios</AnteTitle>
          <Title2 className="mb-4">What a climate scenario is</Title2>
          <BodyText className="w-full md:w-4/5">
            Climate scenarios are plausible representations of the future climate of the Earth,
            based on its current observed state and different greenhouse gas emission scenarios.
          </BodyText>
        </div>
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
