"use client";

import HeaderTitle from "@/containers/scenario-dashboard-container/details-view/header/header-title";
import ModelCombobox from "@/containers/scenario-dashboard-container/details-view/header/model-combobox";
import ScenarioCombobox from "@/containers/scenario-dashboard-container/details-view/header/scenario-combobox";
import RegionCombobox from "@/containers/scenario-dashboard-container/details-view/header/region-combobox";
import StartEndYearsSelection from "@/containers/scenario-dashboard-container/details-view/header/start-end-years-selection";

export default function ScenarioDetailsViewHeader() {
  return (
    <div className="dashboard-container mx-auto mb-8">
      <HeaderTitle />
      <div className="grid grid-cols-[1fr_1fr] items-end gap-4">
        <ModelCombobox />
        <ScenarioCombobox />
      </div>
      <div className="mt-6 grid grid-cols-[1fr_1fr] items-end gap-4">
        <RegionCombobox />
        <StartEndYearsSelection />
      </div>
    </div>
  );
}
