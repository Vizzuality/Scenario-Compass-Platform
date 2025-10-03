"use client";

import { ComboboxFilter } from "@/components/ui/combobox";
import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

export default function ModelCombobox() {
  const { model, setModel } = useBaseUrlParams();

  const { data, isLoading } = useQuery({
    ...queryKeys.models.list(),
  });

  const options = data?.map((model) => ({
    label: model.name,
    value: model.name,
  }));

  const handleModelChange = (model: string) => {
    setModel(model);
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
