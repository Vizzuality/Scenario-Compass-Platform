import { ComponentProps } from "react";
import { env } from "@/env";

type LinkItem = {
  label: string;
  href: NonNullable<ComponentProps<"a">["href"]>;
} & ComponentProps<"a">;

export const INTERNAL_PATHS = {
  HOME: "/",
  GUIDED_EXPLORATION: "/guided-exploration",
  LEARN_BY_TOPIC: "/learn-by-topic",
  SCENARIO_DASHBOARD: "/scenario-dashboard",
  RUN_DASHBOARD_EXPLORATION: "/scenario-dashboard/details",
  SCENARIO_DASHBOARD_EXPLORATION: "/scenario-dashboard/",
  SCENARIO_DASHBOARD_COMPARISON: "/scenario-dashboard/comparison",
  METHODOLOGY: "/methodology",
  CONTACT: "/contact",
} as const;

export const EXTERNAL_PATHS = {
  OTHER_PRODUCTS: "https://shape.apps.ece.iiasa.ac.at/explorer",
  IIASA_LINKEDIN: "https://www.linkedin.com/company/iiasa/",
  IIASA_BLUESKY: "https://bsky.app/profile/iiasa.org",
  IIASA_ABOUT: "https://scenariocompass.org/",
};

export const EXTERNAL_LINKS: Record<"BLUESKY" | "LINKEDIN" | "OTHER_PRODUCTS" | "ABOUT", LinkItem> =
  {
    BLUESKY: {
      href: EXTERNAL_PATHS.IIASA_BLUESKY,
      label: "Bluesky",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "IIASA Bluesky profile",
    },
    LINKEDIN: {
      href: EXTERNAL_PATHS.IIASA_LINKEDIN,
      label: "LinkedIn",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "IIASA LinkedIn profile",
    },
    OTHER_PRODUCTS: {
      href: EXTERNAL_PATHS.OTHER_PRODUCTS,
      label: "Other Products",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "IIASA Data Explorer",
    },
    ABOUT: {
      href: EXTERNAL_PATHS.IIASA_ABOUT,
      label: "About",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "IIASA About page",
    },
  } as const;

export const desktopPaths: LinkItem[] = [
  { href: INTERNAL_PATHS.GUIDED_EXPLORATION, label: "Guided Exploration" },
  ...(env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE
    ? []
    : [
        {
          href: INTERNAL_PATHS.LEARN_BY_TOPIC,
          label: "Learn By Topic",
        },
      ]),
  { href: INTERNAL_PATHS.SCENARIO_DASHBOARD, label: "Scenario Dashboard" },
  { href: INTERNAL_PATHS.METHODOLOGY, label: "Methodology" },
  { ...EXTERNAL_LINKS.OTHER_PRODUCTS },
  { ...EXTERNAL_LINKS.ABOUT },
] as const;

export const mobilePaths: LinkItem[] = [
  ...desktopPaths,
  {
    href: INTERNAL_PATHS.CONTACT,
    label: "Contact",
  },
] as const;
