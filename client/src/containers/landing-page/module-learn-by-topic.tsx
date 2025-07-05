import Image, { StaticImageData } from "next/image";
import lbt1 from "@/assets/images/landing-page/module-learn-by-topic/lbt1.png";
import lbt2 from "@/assets/images/landing-page/module-learn-by-topic/lbt2.png";
import lbt3 from "@/assets/images/landing-page/module-learn-by-topic/lbt3.png";
import lbt4 from "@/assets/images/landing-page/module-learn-by-topic/lbt4.png";
import Link from "next/link";
import { AnteTitle, BodyText, Title2 } from "@/components/custom/typography";

interface CardProps {
  href: string;
  title: string;
  image: StaticImageData;
}

const cardItemsArray: CardProps[] = [
  {
    title: "Energy",
    image: lbt1,
    href: "",
  },
  {
    title: "Land use",
    image: lbt2,
    href: "",
  },
  {
    title: "Water",
    image: lbt3,
    href: "",
  },
  {
    title: "People & Economy",
    image: lbt4,
    href: "",
  },
];

function Card({ title, image, href }: CardProps) {
  return (
    <Link
      href={href}
      className="md:min-h- relative flex h-75 min-h-75 flex-1 flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-6 transition-all duration-500 ease-in-out hover:-translate-y-6 hover:shadow-xl md:h-65 md:min-h-65"
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
    <div
      className={
        "container flex flex-col gap-12 px-4 pt-16 pb-20 md:gap-18 md:px-20 md:pt-28 md:pb-38"
      }
    >
      <div className="flex flex-col">
        <AnteTitle className="mb-6 text-center">learn by Topic</AnteTitle>
        <Title2 className="mb-4 text-center">Choose a topic, uncover the future</Title2>
        <BodyText className="text-center">
          Dive deep into specific themes and their associated scenarios.
        </BodyText>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {cardItemsArray.map((item, index) => {
          return <Card href={item.href} title={item.title} image={item.image} key={index} />;
        })}
      </div>
    </div>
  );
}
