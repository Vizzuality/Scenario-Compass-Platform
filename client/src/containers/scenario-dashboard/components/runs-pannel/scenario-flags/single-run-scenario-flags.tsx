import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getMetaIndicatorsOccurrenceCounts,
  categorizeRuns,
} from "@/containers/scenario-dashboard/utils/flags-utils";
import { CATEGORY_KEYS, CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { reasonsForConcernMap } from "@/lib/config/reasons-of-concern/tooltips";

interface Props {
  result: RunPipelineReturn;
}

export default function SingleRunScenarioFlags({ result }: Props) {
  const categories = categorizeRuns(result.runs);
  const categoriesWithRuns = (Object.keys(categories) as CategoryKey[])
    .map((key) => [key, categories[key]] as const)
    .filter(([, category]) => category.count > 0);

  if (result.isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Reasons for concern
        </p>
        <div className="flex w-full flex-col gap-3">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      </div>
    );
  }

  if (result.isError) {
    return (
      <div className="mt-8 flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Reasons for concern
        </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
      </div>
    );
  }

  const hasOnlyNoFlags =
    categoriesWithRuns.length === 1 && categoriesWithRuns[0][0] === CATEGORY_KEYS.NO_FLAGS;

  return (
    <div className="mt-8 w-full">
      <p className="border-b pb-1.5 text-base font-bold text-stone-800">Reasons for concern</p>
      {categoriesWithRuns.map(([key, category]) => {
        const metaIndicatorOccurrencePairs = getMetaIndicatorsOccurrenceCounts(category.runs);

        return (
          <Accordion type="single" value={key} key={key}>
            <AccordionItem value={key}>
              <AccordionTrigger>
                <div className="flex w-full items-start justify-between gap-4">
                  <div className="flex w-full gap-4">
                    <p className="w-fit">{category.label}</p>
                  </div>
                </div>
              </AccordionTrigger>
              {!hasOnlyNoFlags && (
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-2">
                    <div className="space-y-2 divide-y">
                      {metaIndicatorOccurrencePairs.map((metaIndicatorOccurrencePair) => {
                        const mapItem =
                          reasonsForConcernMap[metaIndicatorOccurrencePair.metaIndicator];
                        const metaIndicator = metaIndicatorOccurrencePair.metaIndicator;
                        return (
                          <div
                            key={metaIndicator}
                            className="flex items-center justify-between gap-2 py-1.5 text-sm"
                          >
                            <div className="font-medium text-gray-800">
                              {mapItem?.flagName || metaIndicator}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              {mapItem && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <InfoIcon size={16} />
                                  </TooltipTrigger>
                                  <TooltipContent className="flex flex-col gap-4">
                                    <p className="w-60 whitespace-pre-line">
                                      {mapItem.description}
                                    </p>
                                    <a
                                      className="text-white underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={mapItem.link}
                                    >
                                      Read more
                                    </a>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
