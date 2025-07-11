import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/custom/heading";

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
      aria-label={title}
    >
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-xl leading-7 font-bold text-stone-800 not-italic">{title}</p>
        <p className="text-lg leading-7 font-normal text-stone-600 not-italic">{description}</p>
      </div>
      <ArrowRight size={24} className="flex-shrink-0" />
    </Link>
  );
}

const backgroundStyles = [
  "bg-[length:0,225%]",
  "bg-[position:left_top,right_-20vh_bottom_-36vh]",
  "md:bg-[length:0%,175%]",
  "md:bg-[position:left_top,right_bottom_-50vh]",
  "lg:bg-[length:20%,80%]",
  "lg:bg-[position:left_top,right_top_700%]",
  "xl:bg-[length:15%,75%]",
  "xl:bg-[position:left_top,right_top_-270%]",
  "2xl:bg-[length:15%,75%]",
  "2xl:bg-[position:left_top,right_top_-20%]",
  `bg-[url("/images/illustrations/illustration_03_cropped.webp"),url("/images/illustrations/illustration_02.webp")]`,
];

export function ModuleGuidedExploration() {
  return (
    <div className={cn("bg-lilac h-fit w-full bg-no-repeat", ...backgroundStyles)}>
      <div
        className={
          "flex flex-col items-center justify-center gap-12 px-4 pt-16 pb-28 md:gap-18 md:px-20 md:pt-28 md:pb-38"
        }
      >
        <div className="flex flex-col">
          <span className="mb-6 text-center text-base leading-6 tracking-[0.64px] uppercase">
            Guided Exploration
          </span>
          <Heading as="h2" size="4xl" className="mb-4 text-center">
            Explore climate futures
          </Heading>
          <p className="text-center text-lg leading-7">
            Answer critical questions about the interplay between land use, climate goals, and food
            security.
          </p>
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
