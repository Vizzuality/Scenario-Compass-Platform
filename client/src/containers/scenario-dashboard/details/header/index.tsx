"use client";

import HeaderTitle from "@/containers/scenario-dashboard/details/header/header-title";
import ModelCombobox from "@/containers/scenario-dashboard/details/header/model-combobox";
import ScenarioCombobox from "@/containers/scenario-dashboard/details/header/scenario-combobox";
import RegionCombobox from "@/containers/scenario-dashboard/details/header/region-combobox";
import YearSelection from "@/containers/scenario-dashboard/details/header/year-selection";

export default function ScenarioDetailsViewHeader() {
  return (
    <div className="container mx-auto mb-8">
      <HeaderTitle />
      <div className="grid grid-cols-[1fr_1fr] items-end gap-4">
        <ModelCombobox />
        <ScenarioCombobox />
      </div>
      <div className="mt-6 grid grid-cols-[1fr_1fr] items-end gap-4">
        <RegionCombobox />
        <YearSelection />
      </div>
    </div>
  );
}
