"use client";

import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { useFilterPointsPipeline } from "@/hooks/use-filter-points-pipeline";
import FlagAccordionItem from "@/containers/scenario-dashboard/components/scenario-flags/flag-accordion";

export default function ScenarioFlags({ variables }: { variables: readonly string[] }) {
  const result0 = useFilterPointsPipeline(variables[0] || "");
  const result1 = useFilterPointsPipeline(variables[1] || "");
  const result2 = useFilterPointsPipeline(variables[2] || "");
  const result3 = useFilterPointsPipeline(variables[3] || "");

  const isLoading =
    result0.isLoading || result1.isLoading || result2.isLoading || result3.isLoading;
  const isError = result0.isError || result1.isError || result2.isError || result3.isError;

  const dataPoints = [
    ...(variables[0] ? result0.dataPoints : []),
    ...(variables[1] ? result1.dataPoints : []),
    ...(variables[2] ? result2.dataPoints : []),
    ...(variables[3] ? result3.dataPoints : []),
  ];

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

  const scenariosRatio = `${dataPointsScenarios.size}/${allScenarios?.length}`;
  const modelsRatio = `${modelsCount}/${allModels?.length}`;

  return (
    <div className="mx-auto flex w-90 flex-col">
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
            Scenarios: {isLoading || isError ? "Loading scenarios..." : scenariosRatio}
          </li>
          <li className="text-foreground text-sm leading-5">
            Models: {isLoading || isError ? "Loading models..." : modelsRatio}
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
