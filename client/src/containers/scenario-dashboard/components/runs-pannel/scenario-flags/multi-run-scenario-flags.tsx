import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { AccordionItemContent } from "@/containers/scenario-dashboard/components/runs-pannel/accordion-item-content";
import { ColoredScenarioBar } from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/colored-scenario-bar";
import ScenarioFlagTrigger from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flag-trigger";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";

interface Props {
  result: RunPipelineReturn;
  prefix?: string;
}

export default function MultiRunScenarioFlags({ result, prefix }: Props) {
  const categories = useMemo(() => categorizeRuns(result.runs), [result.runs]);

  const categoriesWithRuns = useMemo(
    () =>
      (Object.keys(categories) as CategoryKey[])
        .map((key) => [key, categories[key]] as const)
        .filter(([, category]) => category.count > 0),
    [categories],
  );

  const totalCategories = Object.keys(categoriesWithRuns).length;

  if (result.isError) {
    return (
      <div className="mb-6">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Error Loading Scenario Flags...
        </p>
      </div>
    );
  }

  if (result.isLoading) {
    return (
      <div className="mb-6">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Loading Scenario Flags...
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="scenario-flags">
        <AccordionTrigger className="pt-0 pb-1.5 text-base font-bold text-stone-800">
          <p>
            Flags <strong>({totalCategories})</strong>
          </p>
        </AccordionTrigger>
        <AccordionContent>
          <ColoredScenarioBar categories={categories} totalRuns={result.runs.length} />
          <Accordion type="single" collapsible className="w-full">
            {categoriesWithRuns.map(([key, category]) => (
              <AccordionItem key={key} value={key}>
                <ScenarioFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                <AccordionItemContent category={category} />
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
