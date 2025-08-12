export const DATA_COLORS = {
  RED: "#E33021",
  BROWN: "#9C4600",
  YELLOW: "#EDC14B",
  PINK: "#EC8D82",
  PURPLE: "#832DA4",
  BLUE: "#4599DF",
  WHITE: "#FFFFFF",
} as const;

export const CATEGORY_KEYS = {
  HIGH_PLAUSIBILITY: "HIGH_PLAUSIBILITY",
  HIGH_CONCERN: "HIGH_CONCERN",
  MEDIUM_PLAUSIBILITY: "MEDIUM_PLAUSIBILITY",
  MEDIUM_CONCERN: "MEDIUM_CONCERN",
  BOTH_HIGH: "BOTH_HIGH",
  BOTH_MEDIUM: "BOTH_MEDIUM",
  NO_FLAGS: "NO_FLAGS",
} as const;

export const CATEGORY_CONFIG = {
  [CATEGORY_KEYS.HIGH_PLAUSIBILITY]: {
    label: "High plausibility vetting",
    abbrev: "HP",
    color: DATA_COLORS.RED,
  },
  [CATEGORY_KEYS.HIGH_CONCERN]: {
    label: "High reasons for concern",
    abbrev: "HC",
    color: DATA_COLORS.BROWN,
  },
  [CATEGORY_KEYS.MEDIUM_PLAUSIBILITY]: {
    label: "Medium plausibility vetting",
    abbrev: "MP",
    color: DATA_COLORS.YELLOW,
  },
  [CATEGORY_KEYS.MEDIUM_CONCERN]: {
    label: "Medium reasons for concern",
    abbrev: "MC",
    color: DATA_COLORS.PINK,
  },
  [CATEGORY_KEYS.BOTH_HIGH]: {
    label: "Plausibility vetting flags and reasons for concern, and at least one of them is high",
    abbrev: "BH",
    color: DATA_COLORS.PURPLE,
  },
  [CATEGORY_KEYS.BOTH_MEDIUM]: {
    label: "Plausibility vetting flags and reasons for concern, and they are all medium",
    abbrev: "BM",
    color: DATA_COLORS.BLUE,
  },
  [CATEGORY_KEYS.NO_FLAGS]: {
    label: "No flags",
    abbrev: "NF",
    color: DATA_COLORS.WHITE,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;

export const PLAUSIBILITY_META_KEY = "Plausibility Vetting";
export const REASON_FOR_CONCERN_META_KEY = "Reason For Concern";
export const VALUE_HIGH = "high";
export const VALUE_MEDIUM = "medium";

export const getCategoryAbbrev = (categoryKey: string): string | undefined => {
  return CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG]?.abbrev;
};
