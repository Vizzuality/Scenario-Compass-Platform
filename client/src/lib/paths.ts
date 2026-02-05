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
  ABOUT: "/about",
  NOT_FOUND: "/not-found",
  LICENSE: "/license",
} as const;

export const EXTERNAL_PATHS = {
  IIASA_LINKEDIN: "https://www.linkedin.com/company/iiasa/",
  IIASA_BLUESKY: "https://bsky.app/profile/iiasa.org",
  IIASA_DOWNLOAD: "https://download.scenariocompass.org",
  IIASA_CONTACT: "https://sci-info@iiasa.ac.at",
  IIASA_TERMS_OF_USE: "https://iiasa.ac.at/terms-of-use",
};

export const EXTERNAL_LINKS: Record<
  "BLUESKY" | "LINKEDIN" | "DOWNLOAD" | "CONTACT" | "TERMS_OF_USE",
  LinkItem
> = {
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
  DOWNLOAD: {
    href: EXTERNAL_PATHS.IIASA_DOWNLOAD,
    label: "Download",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "IIASA Download XLSX",
  },
  CONTACT: {
    href: EXTERNAL_PATHS.IIASA_CONTACT,
    label: "Contact",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "IIASA Contact page",
  },
  TERMS_OF_USE: {
    href: EXTERNAL_PATHS.IIASA_TERMS_OF_USE,
    label: "Terms of Use",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "IIASA Terms of use page",
  },
} as const;

const allDesktopPaths = [
  // { href: INTERNAL_PATHS.GUIDED_EXPLORATION, label: "Guided Exploration" },
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
  { href: EXTERNAL_LINKS.DOWNLOAD.href, label: EXTERNAL_LINKS.DOWNLOAD.label },
  { href: INTERNAL_PATHS.LICENSE, label: "License" },
  { href: INTERNAL_PATHS.ABOUT, label: "About" },
];

export const desktopPaths: LinkItem[] = env.NEXT_PUBLIC_PRE_LAUNCH_MODE
  ? [{ href: INTERNAL_PATHS.ABOUT, label: "About" }]
  : allDesktopPaths;

export const mobilePaths: LinkItem[] = [...desktopPaths] as const;

export const ABOUT_PAGE_LINKS = {
  IPCC_AR6: "https://www.ipcc.ch/report/ar6/wg3/downloads/report/IPCC_AR6_WGIII_Annex-III.pdf",
  SENSES_TOOLKIT: "https://climatescenarios.org/primer/",
  FEATURED_REGISTRATION: "https://sandbox.scenariocompass.org/tor",
  Heerden: "https://doi.org/10.1038/s41560-025-01703-1",
  Soergel: "https://doi.org/10.1088/1748-9326/ad80af",
  Richters: "https://doi.org/10.5281/zenodo.5782903",
  Gidden: "https://doi.org/10.1038/s41586-023-06724-y",
  Byers: "https://doi.org/10.5281/zenodo.5886911",
};
