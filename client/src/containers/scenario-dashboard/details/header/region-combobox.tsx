import { ComboboxFilter } from "@/components/ui/combobox";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

export default function RegionCombobox() {
  const { model, geography, setGeography, scenario } = useBaseUrlParams({
    useDefaults: false,
  });

  const { data, isLoading } = useQuery({
    ...queryKeys.regions.list({
      iamc: {
        run: {
          scenario: {
            name: String(scenario) ?? undefined,
          },
          model: {
            name: String(model) ?? undefined,
          },
        },
      },
    }),
    enabled: !!scenario && !!model,
  });

  const options = data?.map((region) => ({
    value: region.id.toString(),
    label: region.name,
  }));

  const handleSetRegion = (region: string) => {
    setGeography(region);
  };

  return (
    <ComboboxFilter
      label="Region"
      placeholder="Select region..."
      options={options}
      value={geography?.toString() || ""}
      onChange={handleSetRegion}
      isLoading={isLoading}
      variant="dark"
    />
  );
}
