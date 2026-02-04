import { Heading } from "@/components/custom/heading";
import Link from "next/link";

const Links = {
  IPCC_AR6: "https://www.ipcc.ch/report/ar6/wg3/downloads/report/IPCC_AR6_WGIII_Annex-III.pdf",
  SENSES_TOOLKIT: "https://climatescenarios.org/primer/",
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
              ) with several model comparison projects and recently published studies,
              including
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>
                NAVIGATE: {" "}
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
                SHAPE: {" "}
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
                NGFS Phase V: {" "}
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
                GENIE: {" "}
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
              Submit your scenarios and emissions pathways to the Scenario Compass!
            </h3>
            <p>
              The Scenario Compass will be continuously updated with the latest scientific
              publications on emissions pathways. You can submit your scenarios via the
              <Link
                href={Links.FEATURED_REGISTRATION}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-[1.5px]"
              >
                Scenario Compass Sandbox
              </Link>
              .
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
