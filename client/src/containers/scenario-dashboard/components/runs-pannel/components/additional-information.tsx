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
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import Link from "next/link";

interface Props {
  result: RunPipelineReturn;
}

export default function AdditionalInformation({ result }: Props) {
  const allCounts = useMemo(
    () => getAdditionalInformationMetaIndicatorCounts(result.runs),
    [result.runs],
  );

  if (result.isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Additional Information
        </p>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-full overflow-hidden rounded-md" />
          <Skeleton className="h-6 w-3/4 overflow-hidden rounded-md" />
        </div>
      </div>
    );
  }

  if (result.isError) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Additional Information
        </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
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
              <div className="flex items-center justify-between text-xs text-stone-600">
                <p>Name</p>
                <p>Scenario runs</p>
              </div>
              {allCounts[key]?.map(({ value, count }) => {
                if (key === "Scientific Manuscript (DOI)") {
                  const href = "https://doi.org/" + value;
                  return (
                    <Link
                      key={value}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={href}
                      className="hover:underline"
                    >
                      {value}
                    </Link>
                  );
                } else {
                  return (
                    <div key={value} className="flex justify-between">
                      <span>{value}</span>
                      <b>({count})</b>
                    </div>
                  );
                }
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
