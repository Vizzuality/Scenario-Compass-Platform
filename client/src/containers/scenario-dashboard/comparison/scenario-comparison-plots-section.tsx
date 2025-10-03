"use client";

import React from "react";
import { COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import { FilterGrid } from "@/containers/scenario-dashboard/comparison/filter-grid";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";
import useGetVariablesForTab from "@/hooks/runs/pipeline/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/pipeline/use-combine-runs-for-variables-pipeline";
import { VerticalComparisonPlotGrid } from "@/containers/scenario-dashboard/comparison/vertical-comparison-plot-grid";
import ComparisonStickyFlags from "@/containers/scenario-dashboard/comparison/comparison-sticky-reasons-of-concern";

const prefix = COMPARISON_TAG;

export default function ScenarioComparisonPlotsSection() {
  const leftShowMetric = useShowReasonsForConcern({});
  const rightShowMetric = useShowReasonsForConcern({ prefix });

  const { variables: leftVariables, selectedTab: leftTab } = useGetVariablesForTab({});
  const { variables: rightVariables, selectedTab: rightTab } = useGetVariablesForTab({ prefix });

  const rightResult = useCombineRunsForVariablesPipeline({
    variablesNames: rightVariables,
    prefix,
  });
  const leftResult = useCombineRunsForVariablesPipeline({ variablesNames: leftVariables });

  return (
    <div className="container mx-auto my-8">
      <FilterGrid prefix={prefix} />

      <ComparisonStickyFlags
        leftShowMetric={leftShowMetric}
        rightShowMetric={rightShowMetric}
        leftResult={leftResult}
        rightResult={rightResult}
        prefix={prefix}
      />

      <div className="grid grid-cols-2 gap-0">
        <div className="border-r">
          <div className="flex h-fit w-full flex-col gap-4 pt-6 pr-4">
            <VerticalComparisonPlotGrid selectedTab={leftTab} />
          </div>
        </div>
        <div>
          <div className="flex h-fit w-full flex-col gap-4 pt-6 pl-4">
            <VerticalComparisonPlotGrid selectedTab={rightTab} prefix={prefix} />
          </div>
        </div>
      </div>
    </div>
  );
}
