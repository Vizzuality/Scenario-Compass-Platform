import { Heading } from "@/components/custom/heading";
import Link from "next/link";
import Image from "next/image";

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

export default function MainAboutPageModule() {
  return (
    <section className="flex w-full flex-col items-center bg-white">
      <div className="content-container py-24 pb-10">
        <div className="mx-auto flex w-full max-w-[846px] flex-col gap-10">
          <Heading as="h2" size="4xl" variant="light" className="mb-4 text-center">
            Further information & Resources
          </Heading>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              AR6 and beyond - which scenarios are available?
            </h3>
            <p>
              This resource combines scenarios from the latest IPCC assessment (
              <Link
                href={Links.Byers}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-[1.5px]"
              >
                Byers et al., 2023
              </Link>
              ) and several recently published studies, including.
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>
                NAVIGATE - see for example{" "}
                <Link
                  href={Links.Heerden}
                  target="_blank"
                  className="underline decoration-1 underline-offset-[1.5px]"
                  rel="noopener noreferrer"
                >
                  van Heerden et al. (2025)
                </Link>
              </li>
              <li>
                SHAPE - see for example{" "}
                <Link
                  href={Links.Soergel}
                  target="_blank"
                  className="underline decoration-1 underline-offset-[1.5px]"
                  rel="noopener noreferrer"
                >
                  Soergel et al. (2024)
                </Link>
              </li>
              <li>
                NGFS Phase V – see for example{" "}
                <Link
                  href={Links.Richters}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-1 underline-offset-[1.5px]"
                >
                  Richters et al. (2024)
                </Link>
              </li>
              <li>
                GENIE – see for example{" "}
                <Link
                  href={Links.Gidden}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-1 underline-offset-[1.5px]"
                >
                  Gidden et al (2023)
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              Want your scenario to be featured?
            </h3>
            <p>
              Learn how to submit your scenario{" "}
              <Link
                href={Links.FEATURED_REGISTRATION}
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
              {
                "Based on expert assessments conducted by the [SCI’s scientific working groups] {The Scenario Compass Initiative} scenarios are marked with “flags” to indicate reasons for concern if they exceed feasibility or sustainability thresholds. These flags are marked as “medium” or “high” to indicate the severity of the concern. "
              }
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
            <h3 className="text-2xl leading-8 font-bold text-stone-900">Learn more </h3>
            <ul className="list-inside list-disc space-y-0.5">
              <li>
                <strong>
                  <Link
                    href={Links.IPCC_AR6}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-1 underline-offset-[1.5px]"
                  >
                    IPCC AR6 WG3: Scenarios and Modelling Methods
                  </Link>
                </strong>
                - provides a comprehensive overview of scenarios and modelling methods used by
                Working Group 3 of the IPCC's Sixth Assessment Report (AR6).
              </li>
              <li>
                <strong>
                  <Link
                    href={Links.SENSES_TOOLKIT}
                    className="underline decoration-1 underline-offset-[1.5px]"
                  >
                    Senses Toolkit
                  </Link>
                </strong>{" "}
                – provides a beginner primer.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              The Scenario Compass Initiative
            </h3>
            <p>
              This website and the scenario ensemble are a product of the Scenario Compass
              Initiative (SCI), which brings togethers producers (modelers) and users of climate
              mitigation scenarios.
            </p>
            <p>
              The SCI is coordinated by a Steering Committee, guided by an Advisory Board, and
              supported by six scientific working groups:
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>
                <strong>Energy: </strong>
                Focuses on developing energy-related vetting and evaluation criteria{" "}
              </li>
              <li>
                <strong>Land: </strong>
                Focuses on developing land-related vetting and evaluation criteria{" "}
              </li>
              <li>
                <strong>Downscaling: </strong> Transforms aggregated scenario data into country
                level information (first product to be released in summer 2026)
              </li>
              <li>
                <strong>Emissions and Climate: </strong> Assesses key climate characteristics of
                scenarios
              </li>
              <li>
                <strong>Methodology: </strong> Works to improve scenario categorization and
                methodology
              </li>
              <li>
                <strong>Database Working Group: </strong>Implements data curation and infrastructure
                development
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
