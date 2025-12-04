import AboutPageHero from "@/containers/about-container/about-page-hero";
import { Heading } from "@/components/custom/heading";
import KeyQuestions from "@/containers/about-container/key-questions-module";
import MainAboutPageModule from "@/containers/about-container/main-about-page-module";
import { MembersSection } from "@/containers/about-container/members-section";

export default function AboutPageContainer() {
  return (
    <>
      <AboutPageHero>
        <div className="z-10 container mt-14 flex w-full flex-col gap-8 px-6 pb-20 lg:px-0">
          <Heading variant="light" size="5xl" as="h1" id="hero-title" className="text-left">
            About
          </Heading>
          <h2 className="text-foreground text-xl leading-7 lg:w-2/5">
            The Scenario Compass provides a curated ensemble of science-based scenarios vetted for
            consistency with recent global trends and presented in a consistent, accessible format.
          </h2>
        </div>
      </AboutPageHero>
      <KeyQuestions />
      <MainAboutPageModule />
      <MembersSection />
    </>
  );
}
