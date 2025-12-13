import { useId, useState, useEffect } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";

export const useClimateFilter = (prefix?: string) => {
  const id = useId();
  const { climateCategory, yearNetZero, setClimateCategory, setYearNetZero } =
    useFilterUrlParams(prefix);

  const [pendingCategorySelectedOptions, setPendingCategorySelectedOptions] = useState<string[]>(
    climateCategory || [],
  );
  const [pendingNetZeroSelectedOptions, setPendingNetZeroSelectedOptions] = useState<string[]>(
    yearNetZero || [],
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setPendingCategorySelectedOptions(climateCategory || []);
      setPendingNetZeroSelectedOptions(yearNetZero || []);
    }
  }, [open, climateCategory, yearNetZero]);

  const selectedOptions = [...(climateCategory || []), ...(yearNetZero || [])];

  const toggleValue = (value: string, isClimateCategory: boolean) => {
    if (isClimateCategory) {
      setPendingCategorySelectedOptions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    } else {
      setPendingNetZeroSelectedOptions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    }
  };

  const applyChanges = () => {
    setClimateCategory(
      pendingCategorySelectedOptions.length > 0 ? pendingCategorySelectedOptions : null,
    );
    setYearNetZero(pendingNetZeroSelectedOptions.length > 0 ? pendingNetZeroSelectedOptions : null);
    setOpen(false);
  };

  const removeValue = (valueToRemove: string) => {
    const isClimateCategory = CLIMATE_CATEGORY_FILTER_CONFIG.mappings.some(
      (item) => item.value === valueToRemove,
    );

    if (isClimateCategory) {
      const newValues = (climateCategory || []).filter((v) => v !== valueToRemove);
      setClimateCategory(newValues.length > 0 ? newValues : null);
    } else {
      const newValues = (yearNetZero || []).filter((v) => v !== valueToRemove);
      setYearNetZero(newValues.length > 0 ? newValues : null);
    }
  };

  const clearAll = () => {
    setClimateCategory(null);
    setYearNetZero(null);
    setOpen(false);
  };

  const getLabel = (value: string) => {
    const climateCategoryItem = CLIMATE_CATEGORY_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (climateCategoryItem) {
      return CLIMATE_CATEGORY_FILTER_CONFIG.name;
    }

    const yearNetZeroItem = YEAR_NET_ZERO_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (yearNetZeroItem) {
      return YEAR_NET_ZERO_FILTER_CONFIG.name;
    }

    return value;
  };

  const getDisplayLabel = (value: string) => {
    const climateCategoryItem = CLIMATE_CATEGORY_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (climateCategoryItem) {
      return climateCategoryItem.label;
    }

    const yearNetZeroItem = YEAR_NET_ZERO_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (yearNetZeroItem) {
      return yearNetZeroItem.label;
    }

    return value;
  };

  const hasChanges = () => {
    const currentCategory = climateCategory || [];
    const currentNetZero = yearNetZero || [];

    const categoryChanged =
      pendingCategorySelectedOptions.length !== currentCategory.length ||
      !pendingCategorySelectedOptions.every((val) => currentCategory.includes(val));

    const netZeroChanged =
      pendingNetZeroSelectedOptions.length !== currentNetZero.length ||
      !pendingNetZeroSelectedOptions.every((val) => currentNetZero.includes(val));

    return categoryChanged || netZeroChanged;
  };

  return {
    id,
    selectedOptions,
    pendingCategorySelectedOptions,
    pendingNetZeroSelectedOptions,
    toggleValue,
    applyChanges,
    removeValue,
    clearAll,
    getLabel,
    getDisplayLabel,
    open,
    setOpen,
    hasChanges,
  };
};
