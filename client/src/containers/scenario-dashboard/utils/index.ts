import { geographyConfig } from "@/lib/config/filters/geography-filter-config";

export const filterGeography = (value: string, search: string): number => {
  const option = geographyConfig.find((opt) => opt.id === value);
  if (!option) return 0;

  const label = option.name.toLowerCase();
  const searchTerm = search.toLowerCase();
  const words = label.split(/\s+/);

  return words.some((word) => word.includes(searchTerm)) ? 1 : 0;
};
