"use client";

import { ComboboxFilter } from "@/components/ui/combobox";
import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";

export default function ScenarioCombobox() {
  const { model, setScenario, scenario, setGeography } = useBaseUrlParams();
  const { setSelectedRunId } = useSelectedRunParam();

  const { data, isLoading } = useQuery({
    ...queryKeys.scenarios.list({
      iamc: {
        run: {
          model: {
            name: String(model),
          },
        },
      },
    }),
    enabled: !!model,
  });

  const options = data?.map((model) => ({
    value: model.name,
    label: model.name,
  }));

  const handleScenarioChange = (sceario: string) => {
    setScenario(sceario);
    setGeography(null);
    setSelectedRunId(null);
  };

  return (
    <ComboboxFilter
      label="Scenario"
      placeholder="Select scenario..."
      options={options}
      value={scenario?.toString() || ""}
      onChange={handleScenarioChange}
      variant="dark"
      isLoading={isLoading}
    />
  );
}
