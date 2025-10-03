"use client";

import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { filterGeography } from "@/containers/scenario-dashboard/utils";
import { type VariantProps } from "class-variance-authority";
import { ComboboxFilter, comboboxFilterVariants } from "@/components/ui/combobox";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

type Props = VariantProps<typeof comboboxFilterVariants>;

export default function GeographyFilter({ variant }: Props) {
  const { geography, setGeography } = useBaseUrlParams();

  return (
    <ComboboxFilter
      label="Geography"
      placeholder="Select geography..."
      options={geographyConfig}
      value={geography || ""}
      onChange={setGeography}
      filterFunction={filterGeography}
      variant={variant}
    />
  );
}
