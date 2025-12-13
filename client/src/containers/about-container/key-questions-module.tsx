import { Heading } from "@/components/custom/heading";
import Link from "next/link";

export default function KeyQuestions() {
  return (
    <div className="content-container flex flex-col gap-18 py-24">
      <div className="flex flex-col">
        <span className="mb-6 text-center text-base leading-6 tracking-[0.64px] uppercase">
          Understanding the Scenario Compass
        </span>
        <Heading as="h2" size="4xl" variant="light" className="mb-4 text-center">
          Key questions about our platform
        </Heading>
        <p className="text-center text-lg leading-7 lg:px-32">
          To help you get the most out of the Scenario Compass, we’ve gathered answers to some of
          the most common questions about what it offers, how scenarios are defined, and where the
          information comes from.
        </p>
      </div>
      <div className="grid grid-rows-3 gap-6 xl:grid-cols-3 xl:grid-rows-1">
        <div className="flex flex-col gap-3 rounded-lg bg-white p-8">
          <p className="text-foreground text-2xl leading-8 font-semibold">
            What information does the Scenario Compass Explorer provide?
          </p>
          <p className="leading-6 text-stone-700">
            The Scenario Compass gives an easy entry point to science-based global, regional, and
            national climate change mitigation scenarios. <br /> Every scenario goes through a
            transparent quality-control process. <br />
            For more see:{" "}
            <Link
              href="https://philippverpoort.github.io/scenario-vetting-criteria/criteria_types/"
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >
              How are scenarios quality-controlled?
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-white p-8">
          <p className="text-foreground text-2xl leading-8 font-semibold">What is a scenario?</p>
          <p className="leading-6 text-stone-700">
            A scenario describes one possible future, modeled through consistent assumptions about
            energy, land use, and other socio-economic factors. <br /> Each scenario in the Scenario
            Compass represents a set of interlinked quantitative simulations.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-white p-8">
          <p className="text-foreground text-2xl leading-8 font-semibold">
            Which sources does the Scenario Compass rely on?
          </p>
          <p className="leading-6 text-stone-700">
            Most scenarios come from peer-reviewed research; others come from working papers of
            report. <br /> Each scenario clearly lists its source within the Scenario Compass.
          </p>
        </div>
      </div>
    </div>
  );
}
