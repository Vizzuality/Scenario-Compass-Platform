"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard-container/components/runs-pannel/components/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard-container/components/runs-pannel/components/additional-information";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard-container/components/runs-pannel/scenario-flags/multi-run-scenario-flags-uncontrolled";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard-container/components/comparison/navigate-to-compare-scenarios";
import useShowReasonsForConcern from "@/hooks/nuqs/tabs/use-show-reasons-for-concer";
import useGetVariablesForTab from "@/hooks/nuqs/tabs/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";
import RunHeader from "@/containers/scenario-dashboard-container/components/runs-pannel/run-header";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useSciWeightedStatsParams } from "@/hooks/nuqs/plots/use-sci-weighted-stats-params";

interface Props {
  prefix?: string;
}

export default function RunsPanel({ prefix }: Props) {
  const { variables } = useGetVariablesForTab({ prefix });
  const result = useCombineRunsForVariablesPipeline({ variablesNames: variables, prefix });
  const showMetric = useShowReasonsForConcern({});
  const {
    showSciWeightedMedian,
    setShowSciWeightedMedian,
    showSciWeightedPercentiles,
    setShowSciWeightedPercentiles,
  } = useSciWeightedStatsParams();
  const handleSciWeightedMedianChange = (checked: boolean) => {
    setShowSciWeightedMedian(checked);
    if (!checked) {
      setShowSciWeightedPercentiles(false);
    }
  };

  return (
    <div className="mx-auto flex w-120 flex-col gap-6">
      <NavigateToCompareScenarios />
      <RunHeader runs={result.runs} prefix={prefix} />

      {showMetric && (
        <>
          <ScenarioModelMetrics result={result} />
          <section className="flex flex-col gap-3 border-y border-stone-200 py-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-stone-900">
                Weighted median and 5-95% ranges
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground flex size-5 items-center justify-center"
                    aria-label="Weighted statistics information"
                  >
                    <InfoIcon size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end" sideOffset={8} className="mr-4 max-w-70">
                  <p>
                    The diagnostic indicators are computed according to ensemble-derived weights
                    that account for relevance, quality and diversity.{" "}
                    <a
                      href="https://doi.org/10.1038/s41558-026-02565-5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      Read more -&gt; https://doi.org/10.1038/s41558-026-02565-5
                    </a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="show-sci-weighted-median"
                checked={showSciWeightedMedian}
                onCheckedChange={handleSciWeightedMedianChange}
              />
              <label
                htmlFor="show-sci-weighted-median"
                className="flex-1 text-sm leading-snug text-stone-900"
              >
                Show weighted median (beta)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="show-sci-weighted-percentiles"
                checked={showSciWeightedPercentiles}
                disabled={!showSciWeightedMedian}
                onCheckedChange={setShowSciWeightedPercentiles}
              />
              <label
                htmlFor="show-sci-weighted-percentiles"
                className="flex-1 text-sm leading-snug text-stone-900"
              >
                Show weighted 5-95% range
              </label>
            </div>
          </section>
          <MultiRunScenarioFlags result={result} initialOpen={true} />
          <AdditionalInformation result={result} />
        </>
      )}
    </div>
  );
}

export function RunsPanelSkeleton() {
  return (
    <div className="mt-8 w-120 animate-pulse space-y-6">
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
    </div>
  );
}
