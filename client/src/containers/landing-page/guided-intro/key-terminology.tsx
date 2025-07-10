import Image from "next/image";
import { Text } from "@/components/custom/text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface KeyTerminologyItem {
  title: string;
  description: string;
  image: string;
}

const keyTerminologyItemsArray: KeyTerminologyItem[] = [
  {
    title: "Carbon Dioxide Removal (CDR)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek01.webp",
  },
  {
    title: "Carbon Footprint",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek02.webp",
  },
  {
    title: "Integrated Assessment Models (IAMs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek03.webp",
  },
  {
    title: "Mitigation",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek04.webp",
  },
  {
    title: "Representative Concentration Pathways (RCPs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek05.webp",
  },
  {
    title: "Shared Socioeconomic Pathways (SSPs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "/images/landing-page/module-guided-intro/key-terminology/msek06.webp",
  },
];

function Card({ title, description, image }: KeyTerminologyItem) {
  return (
    <div className="bg-beige-dark flex flex-col gap-16 rounded-lg p-8">
      <Image src={image} alt="" width={117} height={78} aria-hidden={true} />
      <div className="flex flex-col gap-2">
        <Text as="h3" size="xl">
          {title}
        </Text>
        <Text as="p" size="lg">
          {description}
        </Text>
      </div>
    </div>
  );
}

interface Props {
  className?: string;
  onClose?: () => void;
}

export function KeyTerminology({ className, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className={cn("flex flex-col gap-6 md:grid md:grid-cols-3 md:grid-rows-2", className)}>
        {keyTerminologyItemsArray.map((keyTerminologyItem, index) => (
          <Card
            key={index}
            title={keyTerminologyItem.title}
            description={keyTerminologyItem.description}
            image={keyTerminologyItem.image}
          />
        ))}
      </div>
      <Button
        onClick={onClose}
        size="lg"
        variant="ghost"
        className="w-full font-sans text-base leading-5 font-bold md:w-fit"
        aria-label="Button to close key terminology list of terms and definitions"
      >
        Close
      </Button>
    </div>
  );
}
