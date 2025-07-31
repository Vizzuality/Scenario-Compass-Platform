"use client";

import { DataPoint } from "@/components/plots/types/plots";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { Button } from "@/components/ui/button";
import { EyeIcon, Flag, HighlighterIcon, InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  title: string;
  set: Set<string>;
  icon: React.ReactElement;
}

function FlagAccordionItem({ set, icon, title }: Props) {
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

export default function ScenarioFlags({ dataPoints }: { dataPoints: DataPoint[] }) {
  const { data: allScenarios } = useQuery({
    ...queryKeys.scenarios.list({}),
  });
  const { data: allModels } = useQuery({
    ...queryKeys.models.list({}),
  });
  const { data: allMetaIndicators } = useQuery({
    ...queryKeys.metaIndicators.tabulate({}),
  });

  const modelsCount = [...new Set(dataPoints.map((point) => point.model))].length;
  const dataPointsScenarios = new Set(dataPoints.map((point) => point.scenario));

  const metaPoints = getMetaPoints(allMetaIndicators);

  const filteredMetaPoints = metaPoints.filter((metaPoint) =>
    dataPointsScenarios.has(metaPoint.scenario),
  );

  const okPoints = filteredMetaPoints.filter((metaPoint) => metaPoint.value === "ok");
  const mediumPoints = filteredMetaPoints.filter((metaPoint) => metaPoint.value === "medium");
  const highPoints = filteredMetaPoints.filter((metaPoint) => metaPoint.value === "high");

  const okScenariosCount = new Set(okPoints.map((point) => point.key));
  const mediumScenariosCount = new Set(mediumPoints.map((point) => point.key));
  const highScenariosCount = new Set(highPoints.map((point) => point.key));
  const totalFlagsCount =
    okScenariosCount.size + mediumScenariosCount.size + highScenariosCount.size;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <Button className="mt-8 mb-7">
        <p>Compare this scenario set to</p>
        <span className="text-xl">+</span>
      </Button>

      <div className="mb-6">
        <p className="mb-4 border-b pb-1.5 text-base leading-6 font-bold text-stone-800">
          Scenario metrics
        </p>
        <ul className="ml-5 list-outside list-disc space-y-2">
          <li className="text-foreground text-sm leading-5">
            Scenarios: {dataPointsScenarios.size}/{allScenarios?.length}
          </li>
          <li className="text-foreground text-sm leading-5">
            Models: {modelsCount}/{allModels?.length}
          </li>
        </ul>
      </div>

      <p className="border-b pb-1.5 text-base leading-6 font-bold text-stone-800">
        Flags ({totalFlagsCount})
      </p>

      <Accordion type="multiple">
        <FlagAccordionItem
          title="Major Feasibility Concern"
          icon={
            <div className="w-fit rounded-full bg-red-600 p-2 text-white">
              <Flag size={16} />
            </div>
          }
          set={highScenariosCount}
        />
        <FlagAccordionItem
          title="Intermediate Feasibility Concern"
          icon={
            <div className="text-primary w-fit rounded-full bg-yellow-400 p-2">
              <Flag size={16} />
            </div>
          }
          set={mediumScenariosCount}
        />
        <FlagAccordionItem
          title="Sustainability Concern"
          icon={
            <div className="w-fit rounded-full bg-purple-600 p-2 text-white">
              <Flag size={16} />
            </div>
          }
          set={okScenariosCount}
        />
      </Accordion>
    </div>
  );
}
