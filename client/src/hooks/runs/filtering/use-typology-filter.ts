import { useId, useState, useEffect } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import {
  FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG,
  MITIGATION_STRATEGY_FILTER_CONFIG,
} from "@/lib/config/filters/typology-filter-config";

export const useTypologiesFilter = (prefix?: string) => {
  const id = useId();
  const { fossilFuelPhaseDown, mitigationStrategy, setFossilFuelPhaseDown, setMitigationStrategy } =
    useFilterUrlParams(prefix);

  const [pendingFossilFuelSelectedOptions, setPendingFossilFuelSelectedOptions] = useState<
    string[]
  >(fossilFuelPhaseDown || []);
  const [pendingMitigationSelectedOptions, setPendingMitigationSelectedOptions] = useState<
    string[]
  >(mitigationStrategy || []);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setPendingFossilFuelSelectedOptions(fossilFuelPhaseDown || []);
      setPendingMitigationSelectedOptions(mitigationStrategy || []);
    }
  }, [open, fossilFuelPhaseDown, mitigationStrategy]);

  const selectedOptions = [...(fossilFuelPhaseDown || []), ...(mitigationStrategy || [])];

  const toggleValue = (value: string, isFossilFuel: boolean) => {
    if (isFossilFuel) {
      setPendingFossilFuelSelectedOptions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    } else {
      setPendingMitigationSelectedOptions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );
    }
  };

  const applyChanges = () => {
    setFossilFuelPhaseDown(
      pendingFossilFuelSelectedOptions.length > 0 ? pendingFossilFuelSelectedOptions : null,
    );
    setMitigationStrategy(
      pendingMitigationSelectedOptions.length > 0 ? pendingMitigationSelectedOptions : null,
    );
    setOpen(false);
  };

  const removeValue = (valueToRemove: string) => {
    const isFossilFuel = FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings.some(
      (item) => item.value === valueToRemove,
    );

    if (isFossilFuel) {
      const newValues = (fossilFuelPhaseDown || []).filter((v) => v !== valueToRemove);
      setFossilFuelPhaseDown(newValues.length > 0 ? newValues : null);
    } else {
      const newValues = (mitigationStrategy || []).filter((v) => v !== valueToRemove);
      setMitigationStrategy(newValues.length > 0 ? newValues : null);
    }
  };

  const clearAll = () => {
    setFossilFuelPhaseDown(null);
    setMitigationStrategy(null);
    setOpen(false);
  };

  const getLabel = (value: string) => {
    const fossilFuelItem = FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (fossilFuelItem) {
      return FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.name;
    }

    const mitigationItem = MITIGATION_STRATEGY_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (mitigationItem) {
      return MITIGATION_STRATEGY_FILTER_CONFIG.name;
    }

    return value;
  };

  const getDisplayLabel = (value: string) => {
    const fossilFuelItem = FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (fossilFuelItem) {
      return fossilFuelItem.label;
    }

    const mitigationItem = MITIGATION_STRATEGY_FILTER_CONFIG.mappings.find(
      (item) => item.value === value,
    );
    if (mitigationItem) {
      return mitigationItem.label;
    }

    return value;
  };

  const hasChanges = () => {
    const currentFossilFuel = fossilFuelPhaseDown || [];
    const currentMitigation = mitigationStrategy || [];

    const fossilFuelChanged =
      pendingFossilFuelSelectedOptions.length !== currentFossilFuel.length ||
      !pendingFossilFuelSelectedOptions.every((val) => currentFossilFuel.includes(val));

    const mitigationChanged =
      pendingMitigationSelectedOptions.length !== currentMitigation.length ||
      !pendingMitigationSelectedOptions.every((val) => currentMitigation.includes(val));

    return fossilFuelChanged || mitigationChanged;
  };

  return {
    id,
    selectedOptions,
    pendingFossilFuelSelectedOptions,
    pendingMitigationSelectedOptions,
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
