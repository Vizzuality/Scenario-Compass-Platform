"use client";

import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import { SINGLE_SCENARIO_VIEW_PLOTS_CONFIG_ARRAY } from "@/lib/config/tabs/tabs-config";
import { SingleRunPlotWidget } from "@/components/plots/widgets/single-run/single-run-plot-widget";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/components/additional-information";
import { KyotoGasesPlot } from "@/components/plots/plot-variations/custom/kyoto/kyoto-gases-plot";

export default function ScenarioTabs({ runId }: { runId: number }) {
  const { result } = useSyncVariables({ runId });

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto flex gap-16">
        <div className="container mx-auto my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
          <KyotoGasesPlot runId={runId} />
          {SINGLE_SCENARIO_VIEW_PLOTS_CONFIG_ARRAY.map((plotConfig, index) => {
            return <SingleRunPlotWidget key={index} runId={runId} plotConfig={plotConfig} />;
          })}
        </div>
        <div className="flex w-120 flex-col gap-6">
          <SingleRunScenarioFlags result={result} />
          <AdditionalInformation result={result} />
        </div>
      </div>
    </div>
  );
}
