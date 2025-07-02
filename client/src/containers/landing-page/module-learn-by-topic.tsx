import Image, { StaticImageData } from "next/image";
import lbt1 from "@/assets/images/landing-page/module-learn-by-topic/lbt1.png";
import lbt2 from "@/assets/images/landing-page/module-learn-by-topic/lbt2.png";
import lbt3 from "@/assets/images/landing-page/module-learn-by-topic/lbt3.png";
import lbt4 from "@/assets/images/landing-page/module-learn-by-topic/lbt4.png";
import Link from "next/link";

interface CardProps {
  href: string;
  title: string;
  image: StaticImageData;
}
function Card({ title, image, href }: CardProps) {
  return (
    <Link
      href={href}
      className="relative flex h-[260px] w-[302px] flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-6 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-xl"
    >
      <p className="font-display relative z-10 text-center text-2xl leading-8 font-bold text-stone-800 not-italic">
        {title}
      </p>

      <Image src={image} alt={title} className="absolute bottom-0 left-0 z-0 w-full" />
    </Link>
  );
}

export function ModuleLearnByTopic() {
  return (
    <div className={"flex flex-col gap-12 px-4 pt-16 pb-20 md:gap-18 md:px-20 md:pt-28 md:pb-38"}>
      <div>
        <p className="mb-6 text-center font-sans text-base leading-6 font-normal tracking-[0.64px] text-stone-900 uppercase not-italic">
          learn by Topic
        </p>
        <p className="font-display mb-4 text-center text-4xl leading-10 font-bold text-stone-900 not-italic">
          Choose a topic, uncover the future
        </p>
        <p className="text-center font-sans text-lg leading-7 font-normal text-stone-800 not-italic">
          Dive deep into specific themes and their associated scenarios.
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <Card href={""} title={"Energy"} image={lbt1} />
        <Card href={""} title={"Land use"} image={lbt2} />
        <Card href={""} title={"Water"} image={lbt3} />
        <Card href={""} title={"People & Economy"} image={lbt4} />
      </div>
    </div>
  );
}
