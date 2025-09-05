import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo, useState } from "react";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { AccordionItemContent } from "@/containers/scenario-dashboard/components/runs-pannel/accordion-item-content";
import ScenarioFlagTrigger from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flag-trigger";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { ColoredScenarioBar } from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/colored-scenario-bar";

interface Props {
  result: RunPipelineReturn;
  prefix?: string;
}

const SCENARIO_FLAGS_ACCORDION_VALUE = "scenario-flags";

export default function MultiRunScenarioFlags({ result, prefix }: Props) {
  const [isOpen, setIsOpen] = useState(SCENARIO_FLAGS_ACCORDION_VALUE);
  const categories = useMemo(() => categorizeRuns(result.runs), [result.runs]);

  const categoriesWithRuns = useMemo(
    () =>
      (Object.keys(categories) as CategoryKey[])
        .map((key) => [key, categories[key]] as const)
        .filter(([, category]) => category.count > 0),
    [categories],
  );

  const { highCategories, mediumCategories, okCategories } = categoriesWithRuns.reduce(
    (acc, category) => {
      if (category[0].includes("HIGH")) {
        acc.highCategories.push(category);
      } else if (category[0].includes("NO")) {
        acc.okCategories.push(category);
      } else {
        acc.mediumCategories.push(category);
      }
      return acc;
    },
    {
      highCategories: [] as typeof categoriesWithRuns,
      mediumCategories: [] as typeof categoriesWithRuns,
      okCategories: [] as typeof categoriesWithRuns,
    },
  );

  const totalCategories = Object.keys(categoriesWithRuns).length;

  if (result.isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">Flags </p>
        <div className="flex w-full flex-col gap-3">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      </div>
    );
  }

  if (result.isError) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">Flags </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
      </div>
    );
  }

  return (
    <Accordion value={isOpen} onValueChange={setIsOpen} type="single" collapsible>
      <AccordionItem value={SCENARIO_FLAGS_ACCORDION_VALUE} className={isOpen && "border-b-0"}>
        <AccordionTrigger className="pt-0 pb-1.5 text-base font-bold text-stone-800">
          <p className="text-base">Reasons for Concern</p>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 border-t pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex">
              <div className="flex">
                <p>
                  Flags (<strong>{totalCategories}</strong>)
                </p>
                /
                <p>
                  Scenario runs (<strong>{result.runs.length}</strong>)
                </p>
              </div>
            </div>
            <ColoredScenarioBar categories={categories} totalRuns={result.runs.length} />
          </div>
          <div className="flex flex-col gap-5">
            {highCategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <strong className="text-foreground text-xs">HIGH</strong>
                <Accordion type="single" collapsible className="w-full">
                  {highCategories.map(([key, category]) => (
                    <AccordionItem key={key} value={key}>
                      <ScenarioFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                      <AccordionItemContent category={category} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            {mediumCategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <strong className="text-foreground text-xs">MEDIUM</strong>
                <Accordion type="single" collapsible className="w-full">
                  {mediumCategories.map(([key, category]) => (
                    <AccordionItem key={key} value={key}>
                      <ScenarioFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                      <AccordionItemContent category={category} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            {okCategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <strong className="text-foreground text-xs">NONE</strong>
                <Accordion type="single" collapsible className="w-full">
                  {okCategories.map(([key, category]) => (
                    <AccordionItem key={key} value={key}>
                      <ScenarioFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                      <AccordionItemContent category={category} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
