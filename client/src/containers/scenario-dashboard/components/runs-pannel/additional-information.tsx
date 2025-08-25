import { RunPipelineReturn } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import {
  ADDITIONAL_INFORMATION_META_INDICATORS,
  getAdditionalInformationMetaIndicatorCounts,
} from "@/containers/scenario-dashboard/components/runs-pannel/utils";

interface Props {
  result: RunPipelineReturn;
}

export default function AdditionalInformation({ result }: Props) {
  const allCounts = useMemo(
    () => getAdditionalInformationMetaIndicatorCounts(result.runs),
    [result.runs],
  );

  if (result.isError || result.isLoading) {
    return (
      <div className="mb-6">
        <p className="mb-4 border-b pb-1.5 text-base font-bold text-stone-800">
          Loading Additional Information...
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
        Additional Information
      </p>
      <Accordion type="single" collapsible>
        {ADDITIONAL_INFORMATION_META_INDICATORS.map(({ key, label }) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="w-full rounded-none pb-2">
              <div className="flex gap-2">
                <span>{label}</span> <b>({allCounts[key]?.length || 0})</b>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-2 flex flex-col gap-2">
              {allCounts[key]?.map(({ value, count }) => (
                <div key={value} className="flex justify-between">
                  <span>{value}</span>
                  <b>({count})</b>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
