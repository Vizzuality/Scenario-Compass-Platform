import { AccordionContent } from "@/components/ui/accordion";
import { getMetaIndicatorsOccurrenceCounts } from "@/utils/flags-utils/flags-utils";
import { RunCategorySummary } from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";
import { reasonsForConcernMap } from "@/lib/config/reasons-of-concern/tooltips";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface AccordionItemContentProps {
  category: RunCategorySummary;
}

export const AccordionItemContent: React.FC<AccordionItemContentProps> = ({ category }) => {
  const metaIndicatorOccurrencePairs = getMetaIndicatorsOccurrenceCounts(category.runs);
  return (
    <AccordionContent className="pt-2 pb-4">
      <div className="space-y-2 divide-y">
        {metaIndicatorOccurrencePairs.map((metaIndicatorOccurrencePair) => {
          const mapItem = reasonsForConcernMap[metaIndicatorOccurrencePair.metaIndicator];
          const metaIndicator = metaIndicatorOccurrencePair.metaIndicator;
          return (
            <div
              key={metaIndicator}
              className="flex items-start justify-between gap-2 py-1.5 text-sm"
            >
              <div className="font-medium">{mapItem?.flagName || metaIndicator}</div>
              <div className="mr-5.5 flex w-12 items-center justify-end gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <strong>{metaIndicatorOccurrencePair.count}</strong>
                  </TooltipTrigger>
                  <TooltipContent>Number of scenarios</TooltipContent>
                </Tooltip>
                {mapItem && (
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon size={16} />
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col gap-4">
                      <p className="w-60 whitespace-pre-line">{mapItem.description}</p>
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
    </AccordionContent>
  );
};
