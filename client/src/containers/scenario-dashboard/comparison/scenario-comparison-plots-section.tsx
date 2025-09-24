"use client";

import React from "react";
import LeftPanel from "@/containers/scenario-dashboard/comparison/left-panel";
import RightPanel from "@/containers/scenario-dashboard/comparison/right-panel";
import { COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import { FilterGrid } from "@/containers/scenario-dashboard/comparison/filter-grid";

const prefix = COMPARISON_TAG;

export default function ScenarioComparisonPlotsSection() {
  return (
    <div className="container mx-auto my-8">
      <FilterGrid prefix={prefix} />
      <div className="grid grid-cols-2 gap-0">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}
