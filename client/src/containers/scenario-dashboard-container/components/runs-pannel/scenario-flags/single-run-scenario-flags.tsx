import { RunPipelineReturn } from "@/types/data/run";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { AccordionItemContent } from "@/containers/scenario-dashboard-container/components/runs-pannel/components/accordion-item-content";
import { useScenarioFlagsData } from "@/hooks/nuqs/flags/use-scenario-flags-data";

interface Props {
  result: RunPipelineReturn;
}

export default function SingleRunScenarioFlags({ result }: Props) {
  const { highCategories, mediumCategories, okCategories } = useScenarioFlagsData(result.runs);

  if (result.isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Feasibility and Sustainability Criteria
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
          Feasibility and Sustainability Criteria
        </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <p className="border-b pb-1.5 text-base font-bold text-stone-800">
        Feasibility and Sustainability Criteria
      </p>
      <div className="mt-2 flex flex-col gap-5">
        {okCategories.length > 0 && (
          <div className="flex flex-col gap-2">
            {okCategories.map(([_key, category]) => (
              <>
                <div className="[&_svg]:text-foreground flex w-full items-start px-0 py-2">
                  <p className="text-sm">{category.label}</p>
                </div>
                <AccordionItemContent categorySummary={category} />
              </>
            ))}
          </div>
        )}
        {mediumCategories.length > 0 && (
          <div className="flex flex-col gap-2">
            {mediumCategories.map(([_key, category]) => (
              <>
                <div className="[&_svg]:text-foreground flex w-full items-start px-0 py-2">
                  <p className="text-sm">{category.label}</p>
                </div>
                <AccordionItemContent categorySummary={category} />
              </>
            ))}
          </div>
        )}
        {highCategories.length > 0 && (
          <div className="flex flex-col gap-2">
            {highCategories.map(([_key, category]) => (
              <>
                <div className="[&_svg]:text-foreground flex w-full items-start px-0 py-2">
                  <p className="text-sm">{category.label}</p>
                </div>
                <AccordionItemContent categorySummary={category} />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
