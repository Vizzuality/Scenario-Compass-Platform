import { useQueryState } from "nuqs";
import { CATEGORY_CONFIG } from "@/containers/scenario-dashboard/utils/category-config";

type FlagState = "selected" | "hidden" | "default";
type FlagsState = Record<string, FlagState>;

/**
 * Hook for managing scenario flag selection and visibility states.
 * Supports multiple independent flag sets via prefix parameter.
 *
 * @param prefix - Optional prefix to namespace this flag set in the URL
 *                 Use different prefixes for multiple flag visualizations on the same page
 *
 * @example Single flag set (default)
 * const flags = useScenarioFlagsSelection();
 * URL: ?flags=HP:s,MC:h
 *
 * @example Multiple flag sets on same page
 * const topFlags = useScenarioFlagsSelection("top");
 * const bottomFlags = useScenarioFlagsSelection("bottom");
 * URL: ?topFlags=HP:s&bottomFlags=MC:h,BH:s
 *
 * @example Named flag sets for different views
 * const scenarioFlags = useScenarioFlagsSelection("scenario");
 * const comparisonFlags = useScenarioFlagsSelection("comparison");
 * URL: ?scenarioFlags=HP:s&comparisonFlags=MC:h
 */
export const useScenarioFlagsSelection = (prefix: string = "") => {
  const paramName = prefix ? `${prefix}Flags` : "flags";

  const [flagsState, setFlagsState] = useQueryState<FlagsState>(paramName, {
    defaultValue: {},
    serialize: (value: FlagsState) => {
      const filtered = Object.entries(value)
        .filter(([, state]) => state !== "default")
        .map(([abbrev, state]) => {
          if (state === "selected") return `${abbrev}:s`;
          if (state === "hidden") return `${abbrev}:h`;
          return abbrev;
        });
      return filtered.length > 0 ? filtered.join(",") : "";
    },
    parse: (value: string): FlagsState => {
      if (!value) return {};

      const result: FlagsState = {};
      value.split(",").forEach((item) => {
        const [abbrev, flag] = item.split(":");
        if (flag === "s") result[abbrev] = "selected";
        else if (flag === "h") result[abbrev] = "hidden";
        else result[abbrev] = "default";
      });
      return result;
    },
  });

  const getFlagState = (categoryKey: string): FlagState => {
    const abbrev = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
    if (!abbrev) return "default";
    return flagsState[abbrev] || "default";
  };

  const setFlagState = (categoryKey: string, state: FlagState) => {
    const abbrev = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
    if (!abbrev) return;

    if (state === "default") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [abbrev]: _, ...rest } = flagsState;
      setFlagsState(rest);
    } else {
      setFlagsState({ ...flagsState, [abbrev]: state });
    }
  };

  const handleCheckboxChange = (categoryKey: string, checked: boolean) => {
    if (checked) {
      setFlagState(categoryKey, "selected");
    } else {
      setFlagState(categoryKey, "default");
    }
  };

  const handleHideToggle = (categoryKey: string, hide: boolean) => {
    setFlagState(categoryKey, hide ? "hidden" : "default");
  };

  const isCategorySelected = (categoryKey: string) => {
    return getFlagState(categoryKey) === "selected";
  };

  const isCategoryHidden = (categoryKey: string) => {
    return getFlagState(categoryKey) === "hidden";
  };

  const toggleCategory = (categoryKey: string) => {
    const currentState = getFlagState(categoryKey);
    if (currentState === "selected") {
      setFlagState(categoryKey, "default");
    } else {
      setFlagState(categoryKey, "selected");
    }
  };

  const toggleHidden = (categoryKey: string) => {
    const currentState = getFlagState(categoryKey);

    if (currentState === "selected") return;

    setFlagState(categoryKey, currentState === "hidden" ? "default" : "hidden");
  };

  const selectedFlags = Object.entries(flagsState)
    .filter(([, state]) => state === "selected")
    .map(([abbrev]) => abbrev);

  const hiddenFlags = Object.entries(flagsState)
    .filter(([, state]) => state === "hidden")
    .map(([abbrev]) => abbrev);

  return {
    selectedFlags,
    hiddenFlags,
    handleCheckboxChange,
    handleHideToggle,
    isCategorySelected,
    isCategoryHidden,
    toggleCategory,
    toggleHidden,
  };
};
