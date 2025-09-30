import { useId, useState } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";

export const useClimateFilter = (prefix?: string) => {
  const id = useId();
  const { climateCategory, yearNetZero, setClimateCategory, setYearNetZero } =
    useFilterUrlParams(prefix);

  const [pendingCategory, setPendingCategory] = useState<string[]>(climateCategory || []);
  const [pendingNetZero, setPendingNetZero] = useState<string[]>(yearNetZero || []);
  const [open, setOpen] = useState(false);

  const allSelected = [...(climateCategory || []), ...(yearNetZero || [])];

  const toggleValue = (value: string, isClimateCategory: boolean) => {
    if (isClimateCategory) {
      setPendingCategory((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    } else {
      setPendingNetZero((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    }
  };

  const applyChanges = () => {
    setClimateCategory(pendingCategory.length > 0 ? pendingCategory : null);
    setYearNetZero(pendingNetZero.length > 0 ? pendingNetZero : null);
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
    setPendingCategory([]);
    setPendingNetZero([]);
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

  return {
    id,
    allSelected,
    pendingCategory,
    pendingNetZero,
    toggleValue,
    applyChanges,
    removeValue,
    clearAll,
    getLabel,
    getDisplayLabel,
    open,
    setOpen,
  };
};
