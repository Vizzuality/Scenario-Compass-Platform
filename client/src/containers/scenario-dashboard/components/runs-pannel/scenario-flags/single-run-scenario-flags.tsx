import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { AccordionItemContent } from "@/containers/scenario-dashboard/components/runs-pannel/accordion-item-content";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";

interface Props {
  result: RunPipelineReturn;
  prefix?: string;
}

export default function SingleRunScenarioFlags({ result }: Props) {
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
      <div className="mb-6 w-140">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Error Loading Scenario Flags...
        </p>
      </div>
    );
  }

  if (result.isLoading) {
    return (
      <div className="mb-6 w-140">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Loading Scenario Flags...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-140">
      <p className="w-full border-b pb-1.5 text-base font-bold text-stone-800">
        Flags <strong>({totalCategories})</strong>
      </p>
      {categoriesWithRuns.map(([key, category]) => (
        <Accordion type="multiple" key={key}>
          <AccordionItem value={key}>
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex w-full gap-4">
                  <p className="w-fit">{category.label}</p>
                  <strong>({category.count})</strong>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      For more information about this flag, please refer to the link below:
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </AccordionTrigger>
            <AccordionItemContent category={category} />
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
