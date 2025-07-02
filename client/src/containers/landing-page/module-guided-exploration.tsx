import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  href: string;
}

function Card({ title, description, href }: CardProps) {
  return (
    <Link
      href={href}
      className={
        "flex items-center justify-start gap-8 rounded-lg bg-white p-6 transition-all duration-300 ease-in-out hover:translate-x-4 hover:shadow-lg md:w-[700px]"
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
      className={
        "flex flex-col items-center justify-center gap-12 px-4 pt-16 pb-20 md:gap-18 md:px-20 md:pt-28 md:pb-38"
      }
    >
      <div>
        <p className="mb-6 text-center font-sans text-base leading-6 font-normal tracking-[0.64px] text-stone-900 uppercase not-italic">
          Guided Exploration
        </p>
        <p className="font-display mb-4 text-center text-4xl leading-10 font-bold text-stone-900 not-italic">
          Explore climate futures
        </p>
        <p className="text-center font-sans text-lg leading-7 font-normal text-stone-800 not-italic">
          Answer critical questions about the interplay between land use, climate goals, and food
          security.{" "}
        </p>
      </div>
      <div className={"flex flex-col gap-6"}>
        <Card
          title={"Meeting 1.5C targets and food security"}
          description={
            "If we are to meet 1.5C warming targets whilst ensuring the population are fed, what does this mean for biodiversity?"
          }
          href={""}
        />
        <Card
          title={"Carbon removal through forest expansion"}
          description={
            "How much carbon dioxide removal is required from forest expansion to meet a 1.5C target whilst feeding the world population?"
          }
          href={""}
        />
      </div>
    </div>
  );
}
