import { Heading } from "@/components/custom/heading";
import Link from "next/link";
import { AR7_PAGE_LINKS } from "@/lib/paths";
import { CONTENT_LINK_CLASS as linkClassName } from "@/lib/utils";

export default function Ar7ContentModule() {
  return (
    <section className="flex w-full flex-col items-center bg-white">
      <div className="content-container py-24 pb-10">
        <div className="mx-auto flex w-full max-w-[846px] flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Heading as="h2" size="4xl" variant="light" className="text-center">
              Call for Global, Regional and National Scenarios
            </Heading>
            <p className="text-center text-xl font-bold text-stone-900">
              to make data available in support of the next IPCC assessment
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p>
              Authors of the upcoming 7th Assessment Report of the IPCC (AR7) have written two open
              letters (
              <Link
                href={AR7_PAGE_LINKS.OPEN_LETTER_1}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                Zenodo 20419069
              </Link>
              ;{" "}
              <Link
                href={AR7_PAGE_LINKS.OPEN_LETTER_2}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                Zenodo 20356173
              </Link>
              ) encouraging the submission of scenario data to community databases. They highlight
              the <strong>Scenario Compass Initiative</strong> submission portal for global
              scenarios as well as parallel activities for national and regional scenarios (e.g.,
              Africa, Latin America, South Asia, EU).
            </p>
            <p>
              Below, you can find more information for the following calls, or directly go to the
              “sandbox” through which scenario data can be submitted:
            </p>
            <ul className="list-outside list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong>Global scenarios</strong> of emissions and socioeconomic development in an
                economy-wide and/or sectoral context →{" "}
                <Link
                  href={AR7_PAGE_LINKS.GLOBAL_SANDBOX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  sandbox.scenariocompass.org
                </Link>
              </li>
              <li>
                <strong>National and regional scenarios</strong> of emissions and socioeconomic
                development in an economy-wide and/or sectoral context, coordinated by the{" "}
                <Link
                  href={AR7_PAGE_LINKS.IAMC_NATIONAL_SCENARIOS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  IAMC Scientific Working Group on National Scenarios
                </Link>{" "}
                →{" "}
                <Link
                  href={AR7_PAGE_LINKS.NATIONAL_SANDBOX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  national-sandbox.scenariocompass.org
                </Link>
              </li>
            </ul>
            <p>
              Submitting scenario data to these databases is <strong>voluntary</strong>. The IPCC
              aims to assess all available peer-reviewed literature on scenarios regardless of
              whether the underlying data have been submitted to any database (see the section on
              use of scenario data in IPCC reports below). Those who submit scenarios retain full
              rights over their own data. Submission does not restrict any use or sharing by the
              original data producers. Submission to the database does not guarantee that any
              particular scenario will be included in the IPCC assessment or highlighted in any
              specific figure or table.
            </p>
            <p className="italic">
              The Scenario Compass Initiative is thrilled to support the assessment for the next
              IPCC report!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              What scenario data to submit?
            </h3>
            <p>
              In general, all submissions are encouraged. For scenarios to be considered for a
              quantitative assessment the following elements are helpful in facilitating specific
              comparisons in the report:
            </p>
            <ul className="list-outside list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong>Model-based:</strong> the scenario must be developed by a formal
                quantitative model (e.g. integrated assessment model, energy-economy model, general
                or partial equilibrium model, systems dynamics model, energy system optimization
                model, or comparable formal approach).
              </li>
              <li>
                <strong>Temporal coverage:</strong> to inform mitigation efforts assessment, the
                scenario must extend to at least the year 2040 (2100 or beyond is preferred).
              </li>
            </ul>
            <p>Specific highlighted topics would include (this list may be updated):</p>
            <ul className="list-outside list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                Scenarios not following a middle-of-the-road, current-trends-extended socioeconomic
                trajectories
              </li>
              <li>Scenarios exploring equity and justice</li>
              <li>Scenarios enabling cross-Working Group integration</li>
              <li>Scenarios exploring overshoot</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">When to submit?</h3>
            <p>The authors of the Seventh Assessment Report WGIII Chapter 3 write:</p>
            <blockquote className="border-l-2 border-stone-300 pl-4 text-stone-700 italic">
              For the First Order Draft of the WGIII contribution to the Seventh Assessment Report,
              we can consider submissions until 29 September 2026. Scenarios submitted later than
              this date will be considered for the Second Order Draft in 2027. A more detailed
              timeline will follow when the timeline for the Second Order Draft will be decided.
            </blockquote>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">
              Scenario Use in IPCC reports
            </h3>
            <p>
              All scenarios submitted to the database may be considered for inclusion in the IPCC’s
              Seventh Assessment Report (AR7), but submission to a database does not guarantee that
              any particular scenario will be included in an assessment report or highlighted in any
              specific figure or table. The decision on which scenarios to use for specific parts of
              the assessment rests entirely with the AR7 authors, based on the needs of the
              assessment and the quality and relevance of available data. Scenarios will not be
              excluded from the database, but some scenario data may be flagged as ‘not
              fit-for-purpose’ for parts of the IPCC Assessment Report. How exactly such
              ‘fit-for-purpose’ tests would be done remains up to IPCC authors and such decisions
              cannot be fully anticipated in this call text.
            </p>
            <p>
              However, scenarios submitted through the Scenario Compass Initiative and the related
              activity for national and regional scenarios coordinated by the IAMC Scientific
              Working Group on National Scenarios means that:
            </p>
            <ul className="list-outside list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                Authors can efficiently compare scenarios across models and studies using consistent
                variable definitions, units, and data formats.
              </li>
              <li>
                Systematic metadata enables categorisation and filtering by warming outcome,
                socio-economic assumptions, technology portfolio, policy assumptions, and other
                dimensions.
              </li>
              <li>
                Data availability in a structured format supports reproducibility and transparency
                of the assessment.
              </li>
            </ul>
            <p>
              This call is issued by a group of scientists to support IPCC authors in their work. It
              signifies a community effort. It is not issued by the IPCC. The open letter aims to
              indicate to communities how they can make their data available by highlighting an open
              community database resource that is designed to support a comprehensive and consistent
              assessment.
            </p>
            <p>
              A comprehensive overview of scenarios and modelling methods used by Working Group III
              of the IPCC’s Sixth Assessment Report (AR6) is available in{" "}
              <Link
                href={AR7_PAGE_LINKS.IPCC_AR6_ANNEX_III}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                Annex III
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-bold text-stone-900">Data Licensing</h3>
            <p>
              The following principles are adopted for both the scenario submission and public
              release:
            </p>
            <ul className="list-outside list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong>
                  Public release of the scenario data in the Scenario Compass database:
                </strong>{" "}
                Scenario data submitted to the Scenario Compass Initiative will be accessible under
                community-standard licensing terms (similar to the AR6 ensemble), where data can be
                reused in scientific analysis but redistribution is restricted. By transferring
                their work to the Scenario Compass database, researchers agree that their data will
                be made available under these terms.
              </li>
              <li>
                <strong>Submission to the Scenario Compass Sandbox:</strong> Scenarios are first
                submitted to the Scenario Compass Sandbox by the modelling teams. Upon submission,
                modellers indicate whether the scenario is submitted for public use or just for
                testing purposes. All scenarios that are for public use go live immediately.
                Scenarios need to have some documentation to go public. This process allows
                modellers to first evaluate their scenarios with the SCI validation and
                feasibility/sustainability flagging information, and to use post-processing
                workflows including the climate-assessment categorization on preliminary work. Also
                after testing, modelling teams can choose to transfer their scenarios from the
                Sandbox to the public Scenario Compass database (see above).
              </li>
              <li>
                <strong>Full rights retained:</strong> Modelling teams retain full rights over their
                own data. Submission to the Scenario Compass Initiative does not restrict any use,
                sharing, or publication of the data by the original producers.
              </li>
              <li>
                <strong>Preliminary data handling:</strong> Scenario data that has not yet been
                published may be shared with AR7 authors in advance of public release, consistent
                with the IPCC’s procedures for handling unpublished literature. Scenario authors may
                request that preliminary data not be made publicly available until the associated
                publication is accepted. Once the scenario is in its final published form, it will
                be released as part of the public Scenario Compass database.
              </li>
              <li>
                <strong>Attribution:</strong> All users of scenario data from the Scenario Compass
                Initiative are expected to cite the original data source (model, team, and
                associated publication) and the Scenario Compass Initiative.
              </li>
            </ul>
            <p>
              These terms represent a departure from the AR6 database, where data was accessible
              only through the primary sources until the report was published. The shift to public
              release of relevant scenarios upon acceptance of a corresponding manuscript or
              publication of a report follows the recommendations for transparency, reproducibility,
              and broad scientific engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
