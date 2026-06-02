import { Heading } from "@/components/custom/heading";
import AboutPageHero from "@/containers/about-container/about-page-hero";
import Ar7ContentModule from "@/containers/ar7/ar7-content-module";

export default function Ar7PageContainer() {
  return (
    <div>
      <AboutPageHero>
        <div className="content-container z-10 mt-14 flex flex-col gap-8 pb-20">
          <Heading variant="light" size="5xl" as="h1" id="hero-title" className="text-left">
            Contribution to IPCC AR7
          </Heading>
          <h2 className="text-foreground text-xl leading-7 lg:w-2/5">
            The SCI will support the scenario analysis in the next IPCC assessment report
          </h2>
        </div>
      </AboutPageHero>
      <Ar7ContentModule />
    </div>
  );
}
