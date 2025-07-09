import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Text } from "@/components/custom/text";
import { cn } from "@/lib/utils";
import lbt1 from "../../../public/images/landing-page/module-learn-by-topic/lbt1.webp";
import lbt2 from "../../../public/images/landing-page/module-learn-by-topic/lbt2.webp";
import lbt3 from "../../../public/images/landing-page/module-learn-by-topic/lbt3.webp";
import lbt4 from "../../../public/images/landing-page/module-learn-by-topic/lbt4.webp";

interface CardProps {
  href: string;
  title: string;
  imageSrc: StaticImageData;
}

const cardItemsArray: CardProps[] = [
  {
    title: "Energy",
    imageSrc: lbt1,
    href: "",
  },
  {
    title: "Land use",
    imageSrc: lbt2,
    href: "",
  },
  {
    title: "Water",
    imageSrc: lbt3,
    href: "",
  },
  {
    title: "People & Economy",
    imageSrc: lbt4,
    href: "",
  },
];

function Card({ title, imageSrc, href }: CardProps) {
  return (
    <Link
      href={href}
      aria-label={`Learn about ${title}`}
      className={cn(
        "relative flex h-75 min-h-75 flex-1 flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-6 transition-all duration-500 ease-in-out",
        "hover:-translate-y-6 hover:shadow-xl",
        "md:h-65 md:min-h-65",
      )}
    >
      <p className="font-display relative z-10 text-center text-2xl leading-8 font-bold text-stone-800 not-italic">
        {title}
      </p>

      <Image
        quality={100}
        src={imageSrc}
        alt=""
        className="absolute bottom-0 left-0 z-0 w-full"
        aria-hidden={true}
      />
    </Link>
  );
}

export function ModuleLearnByTopic() {
  return (
    <section
      className={
        "container flex flex-col gap-12 px-4 pt-16 pb-20 md:gap-18 md:px-20 md:pt-28 md:pb-38"
      }
    >
      <div className="flex flex-col">
        <Text as="span" size="base" className="mb-6 text-center">
          learn by Topic
        </Text>
        <Text as="h2" size="4xl" className="mb-4 text-center">
          Choose a topic, uncover the future
        </Text>
        <Text as="p" size="lg" className="text-center">
          Dive deep into specific themes and their associated scenarios.
        </Text>
      </div>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 lg:flex lg:flex-row lg:gap-6">
        {cardItemsArray.map((item, index) => {
          return <Card href={item.href} title={item.title} imageSrc={item.imageSrc} key={index} />;
        })}
      </div>
    </section>
  );
}
