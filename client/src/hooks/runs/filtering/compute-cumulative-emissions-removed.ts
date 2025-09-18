import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import {
  EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2,
  EMISSIONS_DIAGNOSTICS_CUMULATIVE_CO2_2020_2100_Gt_CO2,
  CARBON_REMOVAL_KEY,
} from "@/lib/config/filters/advanced-filters-config";

export default function computeCumulativeEmissionsRemoved(metaIndicators: MetaIndicator[]) {
  let value = 0;

  const css = metaIndicators.find(
    (metaIndicator) => metaIndicator.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2,
  );

  const carbon = metaIndicators.find(
    (mi) => mi.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CO2_2020_2100_Gt_CO2,
  );

  if (!carbon || !css) {
    value = 0;
  } else {
    value = (parseInt(css.value) / parseInt(carbon.value)) * 100;
  }

  return {
    key: CARBON_REMOVAL_KEY,
    value: value.toString(),
  };
}
