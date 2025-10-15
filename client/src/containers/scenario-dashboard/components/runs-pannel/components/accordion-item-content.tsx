import { AccordionContent } from "@/components/ui/accordion";
import { getMetaIndicatorsOccurrenceCounts } from "@/containers/scenario-dashboard/utils/flags-utils";
import { RunCategorySummary } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
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
      <div className="flex items-center justify-between text-xs text-stone-600">
        <p>Name</p>
        <p>Scenario runs</p>
      </div>
      <div className="space-y-2 divide-y">
        {metaIndicatorOccurrencePairs.map((metaIndicatorOccurrencePair) => {
          const mapItem = reasonsForConcernMap[metaIndicatorOccurrencePair.metaIndicator];
          const metaIndicator = metaIndicatorOccurrencePair.metaIndicator;
          return (
            <div
              key={metaIndicator}
              className="flex items-center justify-between gap-2 py-1.5 text-sm"
            >
              <div className="font-medium">{mapItem?.flagName || metaIndicator}</div>
              <div className="flex items-center justify-between gap-2">
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
                <strong>{metaIndicatorOccurrencePair.count}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </AccordionContent>
  );
};
