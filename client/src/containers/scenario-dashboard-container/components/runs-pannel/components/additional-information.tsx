import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ADDITIONAL_INFORMATION_META_INDICATORS,
  getAdditionalInformationMetaIndicatorCounts,
} from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { RunPipelineReturn } from "@/types/data/run";
import Link from "next/link";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";

interface Props {
  result: RunPipelineReturn;
  mode?: "details" | "multiple";
}

export default function AdditionalInformation({ result, mode = "multiple" }: Props) {
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection();
  const visibleRuns =
    mode === "multiple" ? filterVisibleRuns(result.runs, hiddenFlags, showVetting) : result.runs;
  const uniqueRuns = [...new Map(visibleRuns.map((run) => [run.runId, run])).values()];
  const allCounts = getAdditionalInformationMetaIndicatorCounts(uniqueRuns);

  const modelsMap = uniqueRuns.reduce(
    (acc, run) => {
      if (run.modelName) {
        acc[run.modelName] = (acc[run.modelName] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedModels = Object.fromEntries(
    Object.entries(modelsMap).sort((a, b) => a[0].localeCompare(b[0])),
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

  const getTooltipText = (key: string) => {
    switch (key) {
      case "Scientific Manuscript (Citation)":
        return `Number of citations`;
      case "Project":
        return "Number of projects";
      case "Scientific Manuscript (DOI)":
        return "Number of scientific manuscripts";
      case "Data Source (DOI)":
        return "Number of data sources";
      default:
        return key;
    }
  };

  return (
    <div>
      <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
        Additional Information
      </p>
      <Accordion type="single" collapsible>
        <AccordionItem value="modeling-frameworks">
          <AccordionTrigger className="[&_svg]:text-foreground w-full gap-2 rounded-none pb-2">
            <div className="-mt-0.5 flex w-full justify-between gap-1.5">
              <div>Modeling frameworks</div>
              <Tooltip>
                <TooltipTrigger>
                  <b>{Object.keys(modelsMap).length}</b>
                </TooltipTrigger>
                <TooltipContent>Number of modeling frameworks</TooltipContent>
              </Tooltip>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-2 flex flex-col gap-2">
            {Object.entries(sortedModels).map(([modelName, count]) => (
              <div key={modelName} className="mr-5.5 flex justify-between">
                <span>{modelName}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <b>{count}</b>
                  </TooltipTrigger>
                  <TooltipContent>Number of scenarios</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        {ADDITIONAL_INFORMATION_META_INDICATORS.map(({ key, label }) => (
          <>
            {allCounts[key]?.length !== 0 && (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="[&_svg]:text-foreground w-full gap-1.5 rounded-none pb-2">
                  <div className="-mt-0.5 flex w-full justify-between gap-2">
                    <span>{label}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <b>{allCounts[key]?.length || 0}</b>
                      </TooltipTrigger>
                      <TooltipContent>{getTooltipText(key)}</TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-2 flex flex-col gap-2">
                  {allCounts[key]?.map(({ value, count }) => {
                    if (key === "Scientific Manuscript (DOI)") {
                      const href = "https://doi.org/" + value;
                      return (
                        <div key={value} className="mr-5.5 flex justify-between">
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
                          <Tooltip>
                            <TooltipTrigger>
                              <b>{count}</b>
                            </TooltipTrigger>
                            <TooltipContent>Number of scenarios</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    } else {
                      return (
                        <div key={value} className="mr-5.5 flex justify-between">
                          <span>{value}</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <b>{count}</b>
                            </TooltipTrigger>
                            <TooltipContent>Number of scenarios</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }
                  })}
                </AccordionContent>
              </AccordionItem>
            )}
          </>
        ))}
      </Accordion>
    </div>
  );
}
