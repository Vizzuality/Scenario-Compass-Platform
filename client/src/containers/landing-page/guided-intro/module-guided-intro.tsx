"use client";

import img from "@/assets/images/landing-page/module-guided-intro/guided-intro.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnteTitle, BodyText, Title2 } from "@/components/custom/typography";
import { KeyTerminology } from "@/containers/landing-page/guided-intro/key-terminology";
import React from "react";

export function ModuleGuidedIntro() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={"container flex flex-col gap-16 px-4 py-16 md:gap-18 lg:px-20 lg:py-28"}>
      <div className="flex flex-col gap-10 md:flex-row md:gap-0">
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
            <Button size="lg" className={"w-full md:w-fit"} onClick={() => setOpen(true)}>
              Key terminology
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
      {open && <KeyTerminology onClose={() => setOpen(false)} />}
    </div>
  );
}
