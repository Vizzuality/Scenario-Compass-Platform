import { geographyOptions } from "@/lib/constants";

export const filterGeography = (value: string, search: string): number => {
  const option = geographyOptions.find((opt) => opt.value === value);
  if (!option) return 0;

  const label = option.label.toLowerCase();
  const searchTerm = search.toLowerCase();
  const words = label.split(/\s+/);

  return words.some((word) => word.includes(searchTerm)) ? 1 : 0;
};
