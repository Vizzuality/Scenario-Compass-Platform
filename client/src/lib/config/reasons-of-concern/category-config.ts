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

export const DATA_COLORS = {
  RED: "#E33021",
  BROWN: "#9C4600",
  YELLOW: "#EDC14B",
  PINK: "#EC8D82",
  PURPLE: "#832DA4",
  BLUE: "#4599DF",
  GREEN: "#4EAD60",
} as const;

export const CATEGORY_KEYS = {
  HIGH_FEASIBILITY: "HIGH_FEASIBILITY",
  HIGH_SUSTAINABILITY: "HIGH_SUSTAINABILITY",
  MEDIUM_FEASIBILITY: "MEDIUM_FEASIBILITY",
  MEDIUM_SUSTAINABILITY: "MEDIUM_SUSTAINABILITY",
  BOTH_HIGH: "BOTH_HIGH",
  BOTH_MEDIUM: "BOTH_MEDIUM",
  NO_FLAGS: "NO_FLAGS",
} as const;

interface CategoryKeyConfig {
  label: string;
  abbrev: string;
  color: string;
  palette: ColorPalette;
}

type ConfigType = {
  [key in keyof typeof CATEGORY_KEYS]: CategoryKeyConfig;
};

// Change ordering in order to change the order of colors inside the Scenario Flags
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

export type CategoryKey = keyof typeof CATEGORY_CONFIG;

export const FEASIBILITY_META_KEY = "Feasibility Concern";
export const SUSTAINABILITY_META_KEY = "Sustainability Concern";
export const VALUE_HIGH = "high";
export const VALUE_MEDIUM = "medium";

export const VETTING2025 = "Vetting|2025";

export const getCategoryAbbrev = (categoryKey: string): string | undefined => {
  return CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
};
