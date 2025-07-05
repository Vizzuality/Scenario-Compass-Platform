import Link from "next/link";
import { ArrowRight } from "lucide-react";
import mge01left from "@/assets/images/ilustrations/ilustration_03_cropped.png";
import mge02right from "@/assets/images/ilustrations/ilustration_02.png";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";
import { AnteTitle, BodyText, Title2 } from "@/components/custom/typography";

interface CardProps {
  title: string;
  description: string;
  href: string;
}

const cardItemsArray: CardProps[] = [
  {
    title: "Meeting 1.5C targets and food security",
    description:
      "If we are to meet 1.5C warming targets whilst ensuring the population are fed, what does this mean for biodiversity?",
    href: "#",
  },
  {
    title: "Carbon removal through forest expansion",
    description:
      "How much carbon dioxide removal is required from forest expansion to meet a 1.5C target whilst feeding the world population?",
    href: "#",
  },
];

function Card({ title, description, href }: CardProps) {
  return (
    <Link
      href={href}
      className={
        "flex items-center justify-start gap-8 rounded-lg bg-white p-6 transition-all duration-400 ease-in-out hover:translate-x-8 hover:shadow-lg md:w-[700px]"
      }
    >
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="font-sans text-xl leading-7 font-bold text-stone-800 not-italic">{title}</p>
        <p className="font-sans text-lg leading-7 font-normal text-stone-600 not-italic">
          {description}
        </p>
      </div>
      <ArrowRight size={24} className="flex-shrink-0" />
    </Link>
  );
}

export function ModuleGuidedExploration() {
  return (
    <div
      className={cn(
        "bg-lilac h-fit w-full bg-no-repeat",
        styles.guidedExplorationBackgroundContainer,
      )}
      style={{
        backgroundImage: `url(${mge01left.src}), url(${mge02right.src})`,
      }}
    >
      <div
        className={
          "flex flex-col items-center justify-center gap-12 px-4 pt-16 pb-28 md:gap-18 md:px-20 md:pt-28 md:pb-38"
        }
      >
        <div className="flex flex-col">
          <AnteTitle className="mb-6 text-center">Guided Exploration</AnteTitle>
          <Title2 className="mb-4 text-center">Explore climate futures</Title2>
          <BodyText className="text-center">
            Answer critical questions about the interplay between land use, climate goals, and food
            security.
          </BodyText>
        </div>
        <div className={"flex flex-col gap-6"}>
          {cardItemsArray.map((item, index) => (
            <Card key={index} title={item.title} description={item.description} href={item.href} />
          ))}
        </div>
      </div>
    </div>
  );
}
