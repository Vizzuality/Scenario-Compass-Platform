import { MetaIndicator } from "@/types/data/meta-indicator";
import {
  EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2,
  CARBON_REMOVAL_KEY,
} from "@/lib/config/filters/advanced-filters-config";

export default function computeCumulativeEmissionsRemoved(metaIndicators: MetaIndicator[]) {
  const css = metaIndicators.find(
    (metaIndicator) => metaIndicator.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2,
  );

  return {
    key: CARBON_REMOVAL_KEY,
    value: css?.value?.toString() ?? "0",
  };
}
