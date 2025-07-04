export const PATHS = {
  HOME: "/",
  GUIDED_EXPLORATION: "/guided-exploration",
  LEARN_BY_TOPIC: "/learn-by-topic",
  EXPLORE_SCENARIOS: "/explore-scenarios",
  METHODOLOGY: "/methodology",
  DATA_HUB: "/data-hub",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;

export const desktopPaths = [
  { href: PATHS.GUIDED_EXPLORATION, label: "Guided Exploration" },
  { href: PATHS.LEARN_BY_TOPIC, label: "Learn By Topic" },
  { href: PATHS.EXPLORE_SCENARIOS, label: "Explore Scenarios" },
  { href: PATHS.METHODOLOGY, label: "Methodology" },
  { href: PATHS.DATA_HUB, label: "Data Hub" },
] as const;

export const mobilePaths = [
  ...desktopPaths,
  { href: PATHS.ABOUT, label: "About" },
  { href: PATHS.CONTACT, label: "Contact" },
] as const;
