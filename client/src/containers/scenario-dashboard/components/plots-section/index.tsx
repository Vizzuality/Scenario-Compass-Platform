"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  EMISSIONS_VARIABLES_OPTIONS,
  ENERGY_VARIABLES_OPTIONS,
  GENERAL_VARIABLES_OPTIONS,
  LAND_USE_VARIABLES_OPTIONS,
} from "@/lib/constants/variables-options";
import ScenarioFlags from "@/containers/scenario-dashboard/components/compare-scenarios-mock";
import { VariablePlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget";

const tabsArray = [
  {
    name: "general",
    variables: GENERAL_VARIABLES_OPTIONS,
  },
  {
    name: "energy",
    variables: ENERGY_VARIABLES_OPTIONS,
  },
  {
    name: "land use",
    variables: LAND_USE_VARIABLES_OPTIONS,
  },
  {
    name: "emissions/climate",
    variables: EMISSIONS_VARIABLES_OPTIONS,
  },
] as const;

type TabArray = "land use" | "energy" | "general" | "emissions/climate";

export default function PlotsSection() {
  const [selectedTab, setSelectedTab] = useState<TabArray>("general");

  const currentTabVariables =
    tabsArray.find((tab) => tab.name === selectedTab)?.variables || GENERAL_VARIABLES_OPTIONS;

  return (
    <>
      <div className="w-full bg-white pt-10">
        <p className="text-foreground container mx-auto">
          Explore the dashboards below, organised by topic and featuring curated variables
        </p>
      </div>
      <div className="flex w-full bg-white pt-9">
        <div className="w-full border-b" />
        <div className="container mx-auto flex shrink-0 pt-4">
          {tabsArray.map((tab, index) => (
            <button
              key={index}
              className={cn(
                "w-full rounded-t-md px-4 py-3 text-xs font-bold uppercase",
                selectedTab === tab.name ? "bg-background border border-b-0" : "border-b bg-white",
              )}
              onClick={() => {
                setSelectedTab(tab.name as TabArray);
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="w-full border-b" />
      </div>
      <div className="container mx-auto flex gap-20">
        <div className="my-8 grid w-full grid-cols-2 grid-rows-2 gap-4">
          <VariablePlotWidget variable={currentTabVariables[0]} />
          <VariablePlotWidget variable={currentTabVariables[1]} />
          <VariablePlotWidget variable={currentTabVariables[2]} />
          <VariablePlotWidget variable={currentTabVariables[3]} />
        </div>
        <ScenarioFlags />
      </div>
    </>
  );
}
