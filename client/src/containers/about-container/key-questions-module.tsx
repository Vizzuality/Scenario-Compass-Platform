import { Heading } from "@/components/custom/heading";

const sections = [
  {
    title: "What information does the Scenario Compass Explorer provide?",
    text:
      "The Scenario Compass gives an easy entry point to science-based global, regional, and\n" +
      "            national climate change mitigation scenarios. Every scenario goes through a transparent\n" +
      "            quality-control process. For more see How are scenarios quality-controlled?",
  },
  {
    title: "What is a scenario? ",
    text:
      "A scenario describes one possible future, modeled through consistent assumptions about\n" +
      "            energy, land use, and other socio-economic factors. Each scenario in the Scenario\n" +
      "            Compass represents a set of interlinked quantitative simulations.",
  },
  {
    title: "            Which sources does the Scenario Compass rely on?\n",
    text:
      "Most scenarios come from peer-reviewed research; others come from working papers of\n" +
      "            report. Each scenario clearly lists its source within the Scenario Compass.",
  },
];

export default function KeyQuestions() {
  return (
    <div className="container flex flex-col gap-18 px-6 py-24">
      <div className="flex flex-col lg:px-32">
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
      <div className="grid grid-rows-3 gap-6 lg:grid-cols-3 lg:grid-rows-1">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-lg bg-white p-8">
            <p className="text-foreground text-2xl leading-8 font-semibold">{section.title}</p>
            <p className="leading-6 text-stone-700">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
