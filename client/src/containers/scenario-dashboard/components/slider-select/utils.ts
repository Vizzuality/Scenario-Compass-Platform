import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";

export const parseCurrentValue = (
  currentValue: string[] | null,
  defaultSelected: string | null,
  defaultRange: [number, number],
): {
  selectedId: string | null;
  range: [number, number];
} => {
  if (currentValue && currentValue.length === 2) {
    const [selectedId, rangeString] = currentValue;
    const rangeParts = rangeString.split(URL_VALUES_FILTER_SEPARATOR);

    if (rangeParts.length === 2) {
      const min = parseInt(rangeParts[0], 10);
      const max = parseInt(rangeParts[1], 10);

      if (!isNaN(min) && !isNaN(max)) {
        return { selectedId, range: [min, max] };
      }
    }
  }

  return { selectedId: defaultSelected, range: defaultRange };
};
