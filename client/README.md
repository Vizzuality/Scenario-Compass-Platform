# Scenario Compass Platform - Client

## Folder Structure

```
client/
├── .next/                          # Next.js build output (auto-generated)
├── docs/                           # Project documentation
├── node_modules/                   # Dependencies (auto-generated)
├── public/                         # Static assets
│   └── images/
│       ├── illustrations/          # Illustration assets
│       └── landing-page/           # Landing page images
├── src/                            # Source code
│   ├── app/                        # Next.js App Router pages
│   │   ├── guided-exploration/     # Guided exploration feature pages
│   │   ├── learn-by-topic/         # Learn by topic feature pages
│   │   ├── methodology/            # Methodology documentation pages
│   │   ├── scenario-dashboard/     # Main scenario dashboard pages
│   │   ├── error.tsx               # Global error boundary
│   │   ├── favicon.ico             # Application favicon
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout component
│   │   ├── not-found.tsx           # 404 page
│   │   ├── page.tsx                # Home page
│   │   └── providers.tsx           # React context providers
│   │
│   ├── assets/                     # Asset files
│   │   ├── icons/                  # Icon assets
│   │   ├── images/                 # Image assets
│   │   └── logo/                   # Logo files
│   │
│   ├── components/                 # React components
│   │   ├── animations/             # Animation components
│   │   ├── cross-links/            # Cross-linking components
│   │   ├── custom/                 # Custom/shared components
│   │   ├── error-state/            # Error state components
│   │   ├── layout/                 # Layout components (header, footer, etc.)
│   │   ├── matomo/                 # Analytics integration
│   │   ├── plots/                  # Data visualization/plot components
│   │   ├── slider-select/          # Slider and select components
│   │   └── ui/                     # Base UI components (shadcn/ui style)
│   │
│   ├── containers/                 # Container/page-level components
│   │   ├── coming-soon-container/  # Coming soon page container
│   │   ├── guided-exploration-container/  # Guided exploration container
│   │   ├── landing-page-container/ # Landing page container
│   │   ├── learn-by-topic-container/      # Learn by topic container
│   │   └── scenario-dashboard-container/  # Scenario dashboard container
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── nuqs/                   # URL state management hooks
│   │   ├── plots/                  # Plot-related hooks
│   │   └── runs/                   # Data runs hooks
│   │
│   ├── lib/                        # Library code and configurations
│   │   ├── api/                    # API client and request functions
│   │   └── config/                 # Application configuration
│   │
│   ├── tests/                      # Test files
│   │   ├── e2e/                    # End-to-end tests
│   │   └── unit/                   # Unit tests
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── data/                   # Data model types
│   │   └── url-params/             # URL parameter types
│   │
│   └── utils/                      # Utility functions
│       ├── data-manipulation/      # Data transformation utilities
│       ├── download-plot-assets-utils/  # Plot download utilities
│       ├── filtering/              # Data filtering utilities
│       ├── flags-utils/            # Feature flag utilities
│       └── plots/                  # Plot-related utilities
│
├── .eslintrc.json                  # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Project dependencies and scripts
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.ts                # Vitest test configuration
```
