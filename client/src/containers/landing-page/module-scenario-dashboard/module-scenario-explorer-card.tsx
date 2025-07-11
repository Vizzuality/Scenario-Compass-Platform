import { CircleCheckBig } from "lucide-react";

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
        <p className="text-background text-xl leading-7 font-bold">{title}</p>
        <p className="text-burgundy-light text-lg leading-7">{description}</p>
      </div>
    </div>
  );
}
