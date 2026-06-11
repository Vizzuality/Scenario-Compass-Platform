import { ModuleHero } from "@/containers/guided-exploration-container/module-hero";
import { cn } from "@/lib/utils";
import { GuidedExplorationFigOne } from "@/containers/guided-exploration-container/figures/guided-exploration-figure-one";
import { ModuleCheckpointComponent } from "@/containers/guided-exploration-container/module-checkpoint";
import { GuidedExplorationFigTwo } from "@/containers/guided-exploration-container/figures/guided-exploration-figure-two";
import { GuidedExplorationFigThree } from "@/containers/guided-exploration-container/figures/guided-exploration-figure-three";
import { Suspense } from "react";

const CONTENT_WIDTH = "mx-auto max-w-[860px]";

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="border-compass-sand mb-6 flex flex-col items-baseline gap-4 border-b pb-3">
      <span className="text-shadow-compass-sand font-extralight tracking-widest whitespace-nowrap uppercase">
        Section {number}
      </span>
      <h2 className="font-display text-3xl font-bold">{title}</h2>
    </div>
  );
}

function FigureCaption({ label, caption }: { label: string; caption: string }) {
  return (
    <div className="mb-4">
      <p className="font-serif font-bold tracking-widest uppercase">{label}</p>
      <p className="border-compass-sand text-compass-slate mt-4 border-t pt-4 italic">{caption}</p>
    </div>
  );
}

export function GuidedExplorationPageContainer() {
  return (
    <>
      <ModuleHero />

      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <main className="px-6 py-16 md:py-24">
          {/* Primer */}
          <div className={cn(CONTENT_WIDTH, "bg-card mb-16 rounded-r p-8 shadow-sm")}>
            <h2 className="font-display mb-3 font-bold tracking-widest uppercase">
              Primer - What you will explore
            </h2>
            <ul className="space-y-2">
              {[
                { label: "Why we model climate futures", anchor: "#why-model-climate-futures" },
                {
                  label: "What the current scenario landscape looks like",
                  anchor: "#scenario-landscape",
                },
                {
                  label:
                    "How feasibility and sustainability considerations reshape what 1.5°C requires",
                  anchor: "#feasibility-and-sustainability",
                },
              ].map(({ label, anchor }) => (
                <li
                  key={anchor}
                  className="relative pl-6 text-lg before:absolute before:left-0 before:content-['–']"
                >
                  <a
                    href={anchor}
                    className="hover:text-burgundy decoration-underline underline transition-colors duration-200 hover:decoration-current"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <section
            id="why-model-climate-futures"
            className={cn(CONTENT_WIDTH, "mb-16 scroll-mt-24")}
          >
            <SectionHeader number={1} title="Why do we model climate futures?" />

            <div className="space-y-5 text-lg">
              <p>
                To limit the negative impacts and consequences of climate change, countries
                committed in the Paris Agreement to limit climate change to well below 2°C, aiming
                for 1.5°C.
              </p>

              <p>
                To understand how to get there – which technologies to scale, how fast emissions
                must fall, what trade-offs could arise – scientists build climate mitigation
                scenarios.
              </p>

              <p>
                A scenario is not a prediction. It is a self-consistent, plausible description of
                how the world could evolve if certain choices were made and certain conditions hold.
                Think of scenarios as maps of possible futures. A cartographer does not predict
                which path a traveler will take; she draws the terrain so the traveler can make an
                informed choice. Modelers do the same: they map the landscape of consequences so
                that decision-makers can navigate it with open eyes.
              </p>

              <p>
                The mapping is done using computation frameworks that link energy systems, land use
                and economies. By collecting many simulations from these models the Scenario Compass
                dataset provides not one map, but an entire atlas – a scenario ensemble.
              </p>

              <p>
                The Scenario Compass is a tool for reading that atlas. It does not tell you which
                scenario will happen. It helps you to understand what scenarios are available, which
                scenarios are more feasible and sustainable than others, and what those scenarios
                tell us about the future.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="scenario-landscape" className={cn(CONTENT_WIDTH, "mb-12 scroll-mt-24")}>
            <SectionHeader number={2} title="The current scenario landscape" />

            <div className="space-y-5 text-lg">
              <p>
                The Scenario Compass dataset builds on the AR6 scenario database, assembled for the
                Sixth Assessment Report of the Intergovernmental Panel on Climate Change (IPCC),
                published in 2022. Since then, new scenarios have extended coverage into areas that
                the original ensemble left unexplored, including scenarios that better represent
                current developments and near-term policy constraints, providing a stronger basis
                for decision-making.
              </p>

              <p>
                The Scenario Compass database is what scientists call an 'ensemble of opportunity'.
                This means it contains the scenarios that modelling teams chose to submit – not a
                systematically representative sample of all possible futures. Some technological and
                socio-economic assumptions appear more often simply because they were conventional
                at the time, or because they were the focus of research. The database is rich, but
                it is not a balanced survey.
              </p>
            </div>
          </section>

          <section className={cn(CONTENT_WIDTH, "mb-12")}>
            <FigureCaption
              label="Figure 1 · The Scenario Map"
              caption="Note on reading this figure: Scenario count reflects modelling conventions, not real-world likelihood — more is not more probable."
            />
          </section>

          <div className="dashboard-container mb-16 w-full">
            <Suspense>
              <GuidedExplorationFigOne />
            </Suspense>
          </div>

          {/* Section 3 */}
          <section
            id="feasibility-and-sustainability"
            className={cn(CONTENT_WIDTH, "mb-12 scroll-mt-24 space-y-5")}
          >
            <SectionHeader number={3} title="Feasibility and sustainability" />

            <p className="text-lg">
              Not every path on a map is equally passable. A route that crosses a lake may be
              geometrically direct but physically impassable. A scenario that reaches net zero by
              2050 – but does so by deploying vast amounts of carbon dioxide removal (CDR) may be
              mathematically consistent but would require extraordinary technological advance and
              growth in land use, water demand, energy input, and financing, all simultaneously,
              within less than 25 years. This scenario is internally consistent – the numbers add up
              – but internal consistency is not the only requirement for a scenario to be used in
              decision making.
            </p>

            <p>The Scenario Compass uses two distinct lenses to assess scenarios:</p>

            <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  title: "Feasibility",
                  text: "asks: can this happen? It examines whether a scenario's requirement, for example the pace of technology development, fall within the bounds of what is plausible given current knowledge.",
                },
                {
                  title: "Sustainability",
                  text: "asks: should this happen, given planetary and social limits? It examines whether a scenario stays within ecological boundaries and respects basic social thresholds. A scenario that addresses the climate challenge by converting vast areas of natural forest to bioenergy plantations might be technically feasible, yet deeply problematic considering other environmental and societal implications.",
                },
              ].map(({ title, text }) => (
                <div key={title} className="bg-card rounded-b p-6 pb-30 shadow-sm">
                  <strong className="font-display mb-3 block">{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <p>
              These two dimensions are independent. A scenario can be technically feasible but
              ecologically unsustainable. A scenario can respect ecological limits but assume
              technological capacities that do not currently exist. Both dimensions matter. Neither
              collapses into the other.
            </p>

            <p>
              These assessments are made by an expert panel convened by the Scenario Compass Initiative. They
              are reviewed annually and subject to public consultation. This process matters:
              the assessments are expert judgments, not objective facts. Scientists can and
              do disagree about where the lines fall. Rather than resolving this disagreement
              artificially, the Scenario Compass puts the choice in your hands – informed by expert
              assessments, you can select your own thresholds and explore how the results change.
            </p>
          </section>

          <section className={cn(CONTENT_WIDTH, "mb-12")}>
            <FigureCaption
              label="Figure 2 · Pathway Explorer"
              caption="Each line represents one scenario's projection over time for the selected variable."
            />
          </section>

          <div className="dashboard-container mb-16 w-full">
            <Suspense>
              <GuidedExplorationFigTwo />
            </Suspense>
          </div>

          <div className={cn(CONTENT_WIDTH, "mb-16")}>
            <Suspense>
              <ModuleCheckpointComponent />
            </Suspense>
          </div>

          <section className={cn(CONTENT_WIDTH, "mb-8 space-y-5")}>
            <SectionHeader
              number={4}
              title="How feasibility and sustainability constraints reshape what 1.5°C requires"
            />

            <p className="text-lg">
              You have mapped the terrain and identified which routes are passable. Now: what do the
              passable routes have in common? What waypoints do they all pass through?
            </p>

            <p className="text-lg">
              When you filter the scenario ensemble to keep only those that both limit warming to
              1.5°C and meet certain feasibility or sustainability thresholds, the benchmark ranges
              change.
            </p>

            <p className="text-lg">Exposing those shifts is the purpose of Figure 3.</p>
          </section>

          <div className="dashboard-container mb-16 w-full">
            <Suspense>
              <GuidedExplorationFigThree />
            </Suspense>
          </div>

          <div className={cn(CONTENT_WIDTH, "mb-16")}>
            <p className="font-bold">Three findings emerge consistently when considering feasibility and sustainability:</p>
            <ol className="text-compass-body mt-4 list-decimal space-y-2 pl-6 text-lg">
              <li>Short-term ambition increases; emissions are more strongly reduced in the next 25 years.</li>
              <li>Speculative carbon removal (CDR) reliance is significantly reduced.</li>
              <li>Demand-side transformations become essential for 1.5°C compatibility.</li>
            </ol>
          </div>

          <footer className={cn(CONTENT_WIDTH, "border-foreground mt-16 border-t-2 pt-8")}>
            <h2 className="font-display mb-3 text-xl font-bold">Where to go next</h2>
            <p className="text-compass-body text-lg italic">
              Explore the Scenario Compass dashboard, compare how different filters affect the
              scenario space, or check individual scenarios.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
