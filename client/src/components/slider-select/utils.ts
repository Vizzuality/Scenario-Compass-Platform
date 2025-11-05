import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";

export const parseRange = (rangeString: string | null): [number, number] | null => {
  if (!rangeString?.trim()) return null;

  const [minStr, maxStr, ...rest] = rangeString.split(URL_VALUES_FILTER_SEPARATOR);

  if (!minStr || !maxStr || rest.length > 0) return null;

  const min = parseInt(minStr.trim(), 10);
  const max = parseInt(maxStr.trim(), 10);

  if (isNaN(min) || isNaN(max) || min > max) return null;

  return [min, max];
};
