"use client";

import SingleRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/single-run-scenario-flags";
import { SINGLE_SCENARIO_VIEW_PLOTS_CONFIG_ARRAY } from "@/lib/config/tabs/tabs-config";
import { SingleRunPlotWidget } from "@/components/plots/widgets/single-run/single-run-plot-widget";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/components/additional-information";
import { KyotoGasesPlot } from "@/components/plots/plot-variations/custom/kyoto/kyoto-gases-plot";
import useGetVariablesForTab from "@/hooks/runs/pipeline/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/pipeline/use-combine-runs-for-variables-pipeline";
import ScenarioDetailsInfo from "@/containers/scenario-dashboard/details/body/scenario-details-info";

export default function ScenarioTabs() {
  const { variables } = useGetVariablesForTab({});
  const result = useCombineRunsForVariablesPipeline({ variablesNames: variables });

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto flex gap-16">
        <div className="container mx-auto my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
          <KyotoGasesPlot />
          {SINGLE_SCENARIO_VIEW_PLOTS_CONFIG_ARRAY.map((plotConfig, index) => {
            return <SingleRunPlotWidget key={index} plotConfig={plotConfig} />;
          })}
        </div>
        <div className="my-8 flex w-120 flex-col gap-6">
          <ScenarioDetailsInfo />
          <SingleRunScenarioFlags result={result} />
          <AdditionalInformation result={result} />
        </div>
      </div>
    </div>
  );
}
