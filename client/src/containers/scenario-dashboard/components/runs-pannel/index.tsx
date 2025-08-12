"use client";

import { Button } from "@/components/ui/button";
import {
  RunPipelineReturn,
  useNewFilterPointsPipeline,
} from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import ScenarioModelMetrics from "@/containers/scenario-dashboard/components/runs-pannel/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/additional-information";
import ScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flags";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

export default function RunsPanel({ variables }: { variables: readonly VARIABLE_TYPE[] }) {
  const result0 = useNewFilterPointsPipeline(variables[0] || "");
  const result1 = useNewFilterPointsPipeline(variables[1] || "");
  const result2 = useNewFilterPointsPipeline(variables[2] || "");
  const result3 = useNewFilterPointsPipeline(variables[3] || "");
  const results = [result0, result1, result2, result3];

  const runs = results.flatMap((r) => r.runs);
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  const runsResult: RunPipelineReturn = { runs, isLoading, isError };

  return (
    <div className="mx-auto flex w-120 flex-col">
      <Button className="mt-8 mb-7">
        <p>Compare this scenario set to</p>
        <span className="text-xl">+</span>
      </Button>
      <ScenarioModelMetrics result={runsResult} />
      <ScenarioFlags result={runsResult} />
      <AdditionalInformation result={runsResult} />
    </div>
  );
}
