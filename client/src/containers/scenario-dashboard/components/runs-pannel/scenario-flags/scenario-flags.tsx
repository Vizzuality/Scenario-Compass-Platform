import { RunPipelineReturn } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useMemo } from "react";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/utils";
import { AccordionItemContent } from "@/containers/scenario-dashboard/components/runs-pannel/accordion-item-content";
import { ColoredScenarioBar } from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/colored-scenario-bar";
import ScenarioFlagTrigger from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flag-trigger";
import { CATEGORY_KEYS, CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";

interface Props {
  result: RunPipelineReturn;
}

export default function ScenarioFlags({ result }: Props) {
  const categories = useMemo(() => categorizeRuns(result.runs), [result.runs]);

  console.log(categories);

  const categoriesWithRuns = useMemo(
    () =>
      (Object.keys(categories) as CategoryKey[])
        .map((key) => [key, categories[key]] as const)
        .filter(([, category]) => category.count > 0)
        .filter(([key]) => key !== CATEGORY_KEYS.NO_FLAGS),
    [categories],
  );

  if (result.isLoading || result.isError) {
    return (
      <div className="mb-6">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Loading Scenario Flags...
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">Flags</p>
      <ColoredScenarioBar categories={categories} totalRuns={result.runs.length} />
      <Accordion type="single" collapsible className="w-full">
        {categoriesWithRuns.map(([key, category]) => (
          <AccordionItem key={key} value={key} className="py-2">
            <ScenarioFlagTrigger categoryKey={key} category={category} />
            <AccordionItemContent category={category} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
