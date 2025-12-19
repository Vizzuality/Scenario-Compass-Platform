import {
  BLUE_COLOR_PALETTE,
  BROWN_COLOR_PALETTE,
  ColorPalette,
  GREEN_COLOR_PALETTE,
  PINK_COLOR_PALETTE,
  PURPLE_COLOR_PALETTE,
  RED_COLOR_PALETTE,
  YELLOW_COLOR_PALETTE,
} from "@/lib/config/reasons-of-concern/colors-config";

/**
 * @fileoverview Category configuration for scenario run classification system.
 *
 * This module defines the categorization system for climate/energy modeling scenario runs
 * based on their feasibility and sustainability concerns. It provides:
 * - Color palettes for visual differentiation
 * - Category definitions and hierarchies
 * - Metadata keys for concern classification
 * - Utility functions for category management
 *
 * @module category-config
 */

/**
 * Standard data visualization color palette used throughout the application.
 *
 * Each color is associated with a specific concern level:
 * - RED: High feasibility concerns (critical)
 * - BROWN: High sustainability concerns (critical)
 * - YELLOW: Medium feasibility concerns (warning)
 * - PINK: Medium sustainability concerns (warning)
 * - PURPLE: Both high concerns (critical combination)
 * - BLUE: Both medium concerns (warning combination)
 * - GREEN: No concerns (ok/safe)
 *
 * @constant
 * @readonly
 */
export const DATA_COLORS = {
  RED: "#E33021",
  BROWN: "#9C4600",
  YELLOW: "#EDC14B",
  PINK: "#EC8D82",
  PURPLE: "#832DA4",
  BLUE: "#4599DF",
  GREEN: "#4EAD60",
} as const;

/**
 * Enumeration of all possible category keys for scenario run classification.
 *
 * Categories are organized by severity and type:
 * - HIGH_*: Critical concerns requiring immediate attention
 * - MEDIUM_*: Moderate concerns requiring monitoring
 * - BOTH_*: Combined concerns from both feasibility and sustainability
 * - NO_FLAGS: No identified concerns
 *
 * @constant
 * @readonly
 */
export const CATEGORY_KEYS = {
  HIGH_FEASIBILITY: "HIGH_FEASIBILITY",
  HIGH_SUSTAINABILITY: "HIGH_SUSTAINABILITY",
  MEDIUM_FEASIBILITY: "MEDIUM_FEASIBILITY",
  MEDIUM_SUSTAINABILITY: "MEDIUM_SUSTAINABILITY",
  BOTH_HIGH: "BOTH_HIGH",
  BOTH_MEDIUM: "BOTH_MEDIUM",
  NO_FLAGS: "NO_FLAGS",
} as const;

/**
 * Configuration interface for each category key.
 *
 * @interface CategoryKeyConfig
 * @property {string} label - Full descriptive label for display in UI
 * @property {string} abbrev - Short abbreviation (2 characters) for compact display in URL
 * @property {string} color - Hex color code for visual representation
 * @property {ColorPalette} palette - Extended color palette for gradients and variations
 */
interface CategoryKeyConfig {
  label: string;
  abbrev: string;
  color: string;
  palette: ColorPalette;
}

/**
 * Type definition for the complete category configuration object.
 * Maps each category key to its configuration settings.
 */
type ConfigType = {
  [key in keyof typeof CATEGORY_KEYS]: CategoryKeyConfig;
};

/**
 * Comprehensive configuration mapping for all scenario run categories.
 *
 * This configuration defines how scenarios are classified, displayed, and color-coded
 * based on their feasibility and sustainability concerns. The order of entries in this
 * object determines the visual ordering in UI components (e.g., Scenario Flags panel).
 *
 * **Severity Hierarchy** (highest to lowest):
 * 1. BOTH_HIGH - Both concerns at high level (Purple)
 * 2. HIGH_SUSTAINABILITY - High sustainability concerns (Brown)
 * 3. HIGH_FEASIBILITY - High feasibility concerns (Red)
 * 4. BOTH_MEDIUM - Both concerns at medium level (Blue)
 * 5. MEDIUM_SUSTAINABILITY - Medium sustainability concerns (Pink)
 * 6. MEDIUM_FEASIBILITY - Medium feasibility concerns (Yellow)
 * 7. NO_FLAGS - No concerns identified (Green)
 *
 * @constant
 * @readonly
 *
 * @example
 * ```ts
 * const highFeasConfig = CATEGORY_CONFIG.HIGH_FEASIBILITY;
 * console.log(highFeasConfig.label); // "High feasibility concerns"
 * console.log(highFeasConfig.abbrev); // "HP"
 * console.log(highFeasConfig.color); // "#E33021"
 * ```
 *
 * @remarks
 * The ordering of properties in this object is significant as it determines display
 * order in UI components. To change the visual ordering, reorder the properties.
 */
export const CATEGORY_CONFIG: ConfigType = {
  [CATEGORY_KEYS.BOTH_HIGH]: {
    label: "Sustainability and feasibility concerns, and at least one of them is high",
    abbrev: "BH",
    color: DATA_COLORS.PURPLE,
    palette: PURPLE_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.HIGH_SUSTAINABILITY]: {
    label: "High sustainability concerns",
    abbrev: "HC",
    color: DATA_COLORS.BROWN,
    palette: BROWN_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.HIGH_FEASIBILITY]: {
    label: "High feasibility concerns",
    abbrev: "HP",
    color: DATA_COLORS.RED,
    palette: RED_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.BOTH_MEDIUM]: {
    label: "Medium sustainability and feasibility concerns",
    abbrev: "BM",
    color: DATA_COLORS.BLUE,
    palette: BLUE_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.MEDIUM_SUSTAINABILITY]: {
    label: "Medium sustainability concerns",
    abbrev: "MC",
    color: DATA_COLORS.PINK,
    palette: PINK_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.MEDIUM_FEASIBILITY]: {
    label: "Medium feasibility concerns",
    abbrev: "MP",
    color: DATA_COLORS.YELLOW,
    palette: YELLOW_COLOR_PALETTE,
  },
  [CATEGORY_KEYS.NO_FLAGS]: {
    label: "No reasons for concern",
    abbrev: "NF",
    color: DATA_COLORS.GREEN,
    palette: GREEN_COLOR_PALETTE,
  },
} as const;

/**
 * Type representing valid category key strings.
 * Ensures type safety when working with category identifiers.
 *
 * @typedef {keyof typeof CATEGORY_CONFIG} CategoryKey
 *
 * @example
 * ```ts
 * function processCategory(key: CategoryKey) {
 *   const config = CATEGORY_CONFIG[key]; // Type-safe access
 *   return config.label;
 * }
 * ```
 */
export type CategoryKey = keyof typeof CATEGORY_CONFIG;

/**
 * Metadata key used to identify feasibility concern levels in scenario run data.
 *
 * This key is used to query and filter runs based on their feasibility assessment.
 * Expected values: "high", "medium", "ok"
 *
 * @constant
 * @see {@link VALUE_HIGH}
 * @see {@link VALUE_MEDIUM}
 * @see {@link VALUE_OK}
 */
export const FEASIBILITY_META_KEY = "Feasibility Concern";

/**
 * Metadata key used to identify sustainability concern levels in scenario run data.
 *
 * This key is used to query and filter runs based on their sustainability assessment.
 * Expected values: "high", "medium", "ok"
 *
 * @constant
 * @see {@link VALUE_HIGH}
 * @see {@link VALUE_MEDIUM}
 * @see {@link VALUE_OK}
 */
export const SUSTAINABILITY_META_KEY = "Sustainability Concern";

/**
 * Value indicator for high-level concerns.
 * Used in conjunction with FEASIBILITY_META_KEY and SUSTAINABILITY_META_KEY.
 *
 * @constant
 * @readonly
 */
export const VALUE_HIGH = "high";

/**
 * Value indicator for medium-level concerns.
 * Used in conjunction with FEASIBILITY_META_KEY and SUSTAINABILITY_META_KEY.
 *
 * @constant
 * @readonly
 */
export const VALUE_MEDIUM = "medium";

/**
 * Value indicator for no concerns (acceptable/ok).
 * Used in conjunction with FEASIBILITY_META_KEY and SUSTAINABILITY_META_KEY.
 *
 * @constant
 * @readonly
 */
export const VALUE_OK = "ok";

/**
 * Identifier for the 2025 vetting process/dataset.
 * Used to filter and identify scenarios that have undergone the 2025 vetting procedure.
 *
 * @constant
 * @readonly
 */
export const VETTING2025 = "Vetting|SCI 2025";

/**
 * Retrieves the abbreviated form of a category key.
 *
 * This utility function safely accesses the abbreviation for any category key,
 * returning undefined if the key is invalid or not found. Useful for displaying
 * compact category indicators in space-constrained UI components.
 *
 * @param categoryKey - The category key to look up (e.g., "HIGH_FEASIBILITY")
 * @returns The two-character abbreviation (e.g., "HP") or undefined if not found
 *
 * @remarks
 * This function performs a safe type cast and property access, so it will not
 * throw errors for invalid keys but will return undefined instead.
 */
export const getCategoryAbbrev = (categoryKey: string): string | undefined => {
  return CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
};
