import { MetaIndicator } from "@/types/data/meta-indicator";
import {
  CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN,
  PEAK_WARMING_KEY,
} from "@/lib/config/filters/advanced-filters-config";

export default function computePeakWarming(metaIndicators: MetaIndicator[]) {
  const peakWarming = metaIndicators.find(
    (metaIndicator) => metaIndicator.key === CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN,
  );

  return {
    key: PEAK_WARMING_KEY,
    value: peakWarming?.value?.toString() ?? "0",
  };
}
