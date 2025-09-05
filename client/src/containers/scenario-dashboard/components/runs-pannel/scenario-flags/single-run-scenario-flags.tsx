import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { AccordionItemContent } from "@/containers/scenario-dashboard/components/runs-pannel/accordion-item-content";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";

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

  if (result.isLoading) {
    return (
      <div className="flex w-140 flex-col gap-3">
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
      <div className="flex w-140 flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">Flags </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-140">
      <p className="w-full border-b pb-1.5 text-base font-bold text-stone-800">
        Reasons for Concern
      </p>
      {categoriesWithRuns.map(([key, category]) => (
        <Accordion type="single" value={key} key={key}>
          <AccordionItem value={key}>
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex w-full gap-4">
                  <p className="w-fit">{category.label}</p>
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
