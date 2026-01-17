import AboutPageHero from "@/containers/about-container/about-page-hero";
import { Heading } from "@/components/custom/heading";
import KeyQuestions from "@/containers/about-container/key-questions-module";
import MainAboutPageModule from "@/containers/about-container/main-about-page-module";
import { MembersSection } from "@/containers/about-container/members-section";
import { env } from "@/env";

export default function AboutPageContainer() {
  const isPrelaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;

  return (
    <>
      <AboutPageHero>
        <div className="content-container z-10 mt-14 flex flex-col gap-8 pb-20">
          <Heading variant="light" size="5xl" as="h1" id="hero-title" className="text-left">
            About
          </Heading>
          <h2 className="text-foreground text-xl leading-7 lg:w-2/5">
            The Scenario Compass provides a curated ensemble of science-based scenarios vetted for
            consistency with recent global trends and presented in a consistent, accessible format.
          </h2>
        </div>
      </AboutPageHero>
      {!isPrelaunch && <KeyQuestions />}
      {!isPrelaunch && <MainAboutPageModule />}
      <MembersSection />
    </>
  );
}
