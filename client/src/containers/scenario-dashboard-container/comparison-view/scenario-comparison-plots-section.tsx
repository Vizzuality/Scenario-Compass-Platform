"use client";

import React from "react";
import { COMPARISON_TAG } from "@/containers/scenario-dashboard-container/constants";
import { FilterGrid } from "@/containers/scenario-dashboard-container/comparison-view/filter-grid";
import useShowReasonsForConcern from "@/hooks/nuqs/tabs/use-show-reasons-for-concer";
import useGetVariablesForTab from "@/hooks/nuqs/tabs/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";
import { VerticalComparisonPlotGrid } from "@/containers/scenario-dashboard-container/comparison-view/vertical-comparison-plot-grid";
import ComparisonStickyFlags from "@/containers/scenario-dashboard-container/comparison-view/comparison-sticky-reasons-of-concern";

const prefix = COMPARISON_TAG;

export default function ScenarioComparisonPlotsSection() {
  const leftShowMetric = useShowReasonsForConcern({});
  const rightShowMetric = useShowReasonsForConcern({ prefix });

  const { variables: leftVariables, selectedTab } = useGetVariablesForTab({});
  const { variables: rightVariables } = useGetVariablesForTab({ prefix });

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
      <VerticalComparisonPlotGrid selectedTab={selectedTab} prefix={prefix} />
    </div>
  );
}
