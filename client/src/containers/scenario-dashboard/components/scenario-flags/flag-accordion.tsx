import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EyeIcon, HighlighterIcon, InfoIcon } from "lucide-react";

interface Props {
  title: string;
  set: Set<string>;
  icon: React.ReactElement;
}

export default function FlagAccordionItem({ set, icon, title }: Props) {
  return (
    <AccordionItem value={title} className="mt-6 last:border-b">
      {icon}
      <AccordionTrigger className="items-center gap-2">
        <div className="flex w-full justify-between gap-4">
          <p className="whitespace-nowrap">
            {title} ({set.size})
          </p>
          <div className="flex items-center gap-2">
            <EyeIcon size={16} />
            <HighlighterIcon size={16} />
            <InfoIcon size={16} />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2">
        {Array.from(set.entries()).map((entry, index) => (
          <div key={index}>{entry[0]}</div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
