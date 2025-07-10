import { CircleCheckBig } from "lucide-react";
import { Text } from "@/components/custom/text";

export function ModuleScenarioExplorerCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="bg-burgundy-dark h-fit w-fit rounded-full p-4">
        <CircleCheckBig className="h-8 w-8 text-green-400" aria-hidden={true} />
      </div>
      <div className="flex flex-col">
        <Text as="h3" size="xl" variant="dark" className="font-bold">
          {title}
        </Text>
        <p className="text-burgundy-light font-sans text-lg leading-7 font-normal">{description}</p>
      </div>
    </div>
  );
}
