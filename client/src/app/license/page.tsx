import { Heading } from "@/components/custom/heading";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar/navbar";
import Image from "next/image";
import Link from "next/link";

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
          <h2 className="text-background h-20 text-xl leading-7 lg:w-2/5"></h2>
        </div>
      </div>
      <section className="flex w-full flex-col items-center bg-white">
        <div className="content-container flex max-w-[846px] flex-col gap-8 py-24 pb-10">
          <h2 className="text-xl leading-7 text-black">
            Copyright 2026 IIASA and contributing modeling teams
          </h2>
          <p className="text-black">
            This website contains scenario data associated with unpublished research and a
            manuscript currently under peer review.
          </p>
          <p className="text-black">
            The data may be used for scientific research purposes. However, users must strictly
            adhere to the applicable{" "}
            <Link
              href="https://www.nature.com/nature-portfolio/editorial-policies/preprints-and-conference-proceedings"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Nature editorial policies and embargo rules
            </Link>{" "}
            until the manuscript has been formally published.
          </p>
          <p className="text-black">
            Please use the following citation when using the data:
            <br />
            <em>
              "Mitigation benchmarks from the 2025 community update of global emissions pathways"
            </em>{" "}
            (Riahi et al., submitted).
            <br />A preprint of the submitted manuscript will be provided shortly.
          </p>
        </div>
      </section>
    </>
  );
}
