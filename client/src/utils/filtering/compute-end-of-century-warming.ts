import { MetaIndicator } from "@/types/data/meta-indicator";
import {
  CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN,
  END_OF_CENTURY_WARMING_KEY,
} from "@/lib/config/filters/advanced-filters-config";

export default function computeEndOfCenturyWarming(metaIndicators: MetaIndicator[]) {
  const eocWarming = metaIndicators.find(
    (metaIndicator) => metaIndicator.key === CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN,
  );

  return {
    key: END_OF_CENTURY_WARMING_KEY,
    value: eocWarming?.value?.toString() ?? "0",
  };
}
