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

// Change ordering in order to change the order of colors inside the Scenario Flags
export const CATEGORY_CONFIG = {
  [CATEGORY_KEYS.BOTH_HIGH]: {
    label: "Sustainability and feasibility concerns, and at least one of them is high",
    abbrev: "BH",
    color: DATA_COLORS.PURPLE,
  },
  [CATEGORY_KEYS.HIGH_SUSTAINABILITY]: {
    label: "High sustainability concerns",
    abbrev: "HC",
    color: DATA_COLORS.BROWN,
  },
  [CATEGORY_KEYS.HIGH_FEASIBILITY]: {
    label: "High feasibility concerns",
    abbrev: "HP",
    color: DATA_COLORS.RED,
  },
  [CATEGORY_KEYS.BOTH_MEDIUM]: {
    label: "Medium sustainability and feasibility concerns",
    abbrev: "BM",
    color: DATA_COLORS.BLUE,
  },
  [CATEGORY_KEYS.MEDIUM_SUSTAINABILITY]: {
    label: "Medium sustainability concerns",
    abbrev: "MC",
    color: DATA_COLORS.PINK,
  },
  [CATEGORY_KEYS.MEDIUM_FEASIBILITY]: {
    label: "Medium feasibility concerns",
    abbrev: "MP",
    color: DATA_COLORS.YELLOW,
  },
  [CATEGORY_KEYS.NO_FLAGS]: {
    label: "No reasons for concern",
    abbrev: "NF",
    color: DATA_COLORS.GREEN,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;

export const FEASIBILITY_META_KEY = "Feasibility Concern";
export const SUSTAINABILITY_META_KEY = "Sustainability Concern";
export const VALUE_HIGH = "high";
export const VALUE_MEDIUM = "medium";

export const getCategoryAbbrev = (categoryKey: string): string | undefined => {
  return CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
};
