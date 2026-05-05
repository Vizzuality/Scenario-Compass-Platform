"use client";

import { ComboboxFilter } from "@/components/ui/combobox";
import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";

export default function ModelCombobox() {
  const { model, setModel, setGeography, setScenario } = useBaseUrlParams();
  const { setSelectedRunId } = useSelectedRunParam();

  const { data, isLoading } = useQuery({
    ...queryKeys.models.list(),
  });

  const options = data?.map((model) => ({
    label: model.name,
    value: model.name,
  }));

  const handleModelChange = (model: string) => {
    setModel(model);
    setScenario(null);
    setGeography(null);
    setSelectedRunId(null);
  };

  return (
    <ComboboxFilter
      label="Model"
      placeholder="Select model..."
      options={options}
      value={model?.toString() || ""}
      onChange={handleModelChange}
      variant="dark"
      isLoading={isLoading}
    />
  );
}
