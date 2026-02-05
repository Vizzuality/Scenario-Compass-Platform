import { Heading } from "@/components/custom/heading";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar/navbar";
import Image from "next/image";

export default function LicensePage() {
  return (
    <>
      <div
        className={cn(
          "bg-burgundy relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
        )}
      >
        <Navbar theme="dark" sheetTheme="burgundy" />
        <div className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full items-center justify-center lg:flex">
          <div className="container mx-auto flex h-full w-full items-end justify-end">
            <Image
              src="/images/about-page/Illustration-02.webp"
              alt=""
              height={1365}
              width={2941}
              className="h-full w-auto scale-x-[-1] object-contain"
              priority
              quality={100}
            />
          </div>
        </div>
        <div className="content-container z-10 mt-14 flex flex-col gap-8 pb-20">
          <Heading variant="dark" size="5xl" as="h1" id="hero-title" className="text-left">
            License
          </Heading>
          <h2 className="text-background text-xl leading-7 lg:w-2/5">
            Copyright 2026 IIASA and contributing modeling teams
          </h2>
        </div>
      </div>
      <section className="flex w-full flex-col items-center bg-white">
        <div className="content-container flex max-w-[846px] flex-col gap-8 py-24 pb-10">
          <p className="text-black">
            This website contains scenario data related to unpublished research and a manuscript
            under review.
          </p>
          <p className="text-black">
            It is ok to use the data for scientific research, but please do not share or distribute
            the data without permission from the Scenario Compass Initiative.
          </p>
          <p className="text-black">
            Upon acceptance of the related manuscript, the scenario data will be released under a
            license that permits reuse and redistribution of parts of the data.
          </p>
        </div>
      </section>
    </>
  );
}
