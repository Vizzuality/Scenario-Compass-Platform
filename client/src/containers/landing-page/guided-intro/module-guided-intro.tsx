"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/custom/text";
import { KeyTerminology } from "@/containers/landing-page/guided-intro/key-terminology";
import React from "react";
import { cn } from "@/lib/utils";

export function ModuleGuidedIntro() {
  const [open, setOpen] = React.useState(false);

  return (
    <section
      className={"container flex flex-col gap-16 px-4 py-16 md:px-10 lg:gap-18 lg:px-20 lg:py-28"}
    >
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-10">
        <div className={"order-2 flex flex-col gap-14 lg:order-1 lg:w-1/2"}>
          <div className="flex flex-col">
            <Text as="span" size="base" className="mb-6">
              Introduction to Scenarios
            </Text>
            <Text as="h2" size="4xl" className="mb-4">
              What a climate scenario is
            </Text>
            <Text as="h3" size="lg" className="w-full lg:w-4/5">
              Climate scenarios are plausible representations of the future climate of the Earth,
              based on its current observed state and different greenhouse gas emission scenarios.
            </Text>
          </div>
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <Button size="lg" variant="outline" asChild>
              <Link
                href={""}
                className={
                  "order-2 w-full font-sans text-base leading-5 font-bold md:order-1 md:w-fit"
                }
              >
                Methodology overview
              </Link>
            </Button>
            <Button
              size="lg"
              className={"w-full font-sans text-base leading-5 font-bold md:w-fit"}
              onClick={() => setOpen(true)}
            >
              Key terminology
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "order-1 aspect-video w-full bg-cover bg-center bg-no-repeat lg:order-2 lg:w-1/2",
            `bg-[url("/images/landing-page/module-guided-intro/mgi01.png")]`,
          )}
        />
      </div>
      {open && <KeyTerminology onClose={() => setOpen(false)} />}
    </section>
  );
}
