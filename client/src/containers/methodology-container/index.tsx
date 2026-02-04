import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/custom/heading";
import MethodologyPageHero from "@/containers/methodology-container/methodology-page-hero";

const Links = {
  IPCC_AR6: "https://www.ipcc.ch/report/ar6/wg3/downloads/report/IPCC_AR6_WGIII_Annex-III.pdf",
  SENSES_TOOLKIT: "https://climatescenarios.org/primer/",
  QUALITY_CONTROLLER: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_types/",
  FEATURED_REGISTRATION: "https://sandbox.scenariocompass.org/tor",
  Heerden: "https://doi.org/10.1038/s41560-025-01703-1",
  Soergel: "https://doi.org/10.1088/1748-9326/ad80af",
  Richters: "https://doi.org/10.5281/zenodo.5782903",
  Gidden: "https://doi.org/10.1038/s41586-023-06724-y",
  Byers: "https://doi.org/10.5281/zenodo.5886911",
};

export default function MethodologyContainer() {
  return (
    <>
      <MethodologyPageHero>
        <div className="content-container z-10 mt-14 flex flex-col gap-8 pb-20">
          <Heading variant="light" size="5xl" as="h1" id="hero-title" className="text-left">
            Methodology
          </Heading>
          <h2 className="text-foreground text-xl leading-7 lg:w-2/5">
            The Scenario Compass offers a suite of features that make it easier to draw reliable
            insights from scenario sets. <br />
            Learn about how scenarios are quality-controlled and assessed in terms of sustainability
            and feasibility.
          </h2>
        </div>
      </MethodologyPageHero>
      <section className="flex w-full flex-col items-center bg-white">
        <div className="content-container flex max-w-[846px] flex-col gap-8 py-24 pb-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              How are scenarios quality-controlled?
            </h3>
            <p>
              {
                "Scenarios are evaluated against historical data along key dimensions of energy consumption and emissions. The quality criteria were developed by the Scenario Compass Initiative (SCI) [scientific working groups] {The Scenario Compass Initiative} and were subject to a public review process. Scenarios that fail historical data checks are hidden by default but can be shown in the visualizations. Please see a screenshot below:"
              }
            </p>
            <Image
              src="/images/about-page/vetting2025.webp"
              alt=""
              width={420}
              height={135}
              className="pointer-events-none"
            />
            <p>
              More information on vetting criteria can be found{" "}
              <Link
                href={Links.QUALITY_CONTROLLER}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-[1.5px]"
              >
                here
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              How do sustainability and feasibility criteria (“flags”) communicate expert
              assessments?
            </h3>
            <p>
              Based on expert assessments conducted by the{" "}
              <Link className="underline" href="/about#scenario-compass-initiative">
                SCI's scientific working groups
              </Link>{" "}
              scenarios are marked with “flags” to indicate reasons for concern if they exceed
              feasibility or sustainability thresholds. These flags are marked as “medium” or “high”
              to indicate the severity of the concern.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              How to interpret a set of scenarios?
            </h3>
            <p>
              Scenarios in the Scenario Compass come from a variety of published studies — an
              &#34;ensemble of opportunity” of what is available, not a representative exploration
              of all possible futures. This means you cannot infer probabilities from their number
              or frequency. The Scenario Compass should be used primarily to understand the
              implications of different assumptions about the future.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              New tools will be released later this year
            </h3>
            <p>
              SCI is developing a range of methodological tools that will facilitate the
              interpretation of scenario data. These will be introduced in the coming months.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
