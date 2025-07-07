import msek01 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek01.png";
import msek02 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek02.png";
import msek03 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek03.png";
import msek04 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek04.png";
import msek05 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek05.png";
import msek06 from "../../../../public/assets/images/landing-page/module-guided-intro/key-terminology/msek06.png";

import Image, { StaticImageData } from "next/image";
import { Text } from "@/components/custom/text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface KeyTerminologyItem {
  title: string;
  description: string;
  image: StaticImageData;
}

const keyTerminologyItemsArray: KeyTerminologyItem[] = [
  {
    title: "Carbon Dioxide Removal (CDR)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek01,
  },
  {
    title: "Carbon Footprint",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek02,
  },
  {
    title: "Integrated Assessment Models (IAMs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek03,
  },
  {
    title: "Mitigation",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek04,
  },
  {
    title: "Representative Concentration Pathways (RCPs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek05,
  },
  {
    title: "Shared Socioeconomic Pathways (SSPs)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: msek06,
  },
];

function Card({ title, description, image }: KeyTerminologyItem) {
  return (
    <div className="bg-beige-dark flex flex-col gap-16 rounded-lg p-8">
      <Image src={image} alt={title} width={117} height={78} />
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
      <Button onClick={onClose} size="lg" variant="ghost" className="w-full md:w-fit">
        Close
      </Button>
    </div>
  );
}
