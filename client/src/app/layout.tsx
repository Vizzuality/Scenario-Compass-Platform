import { ReactNode } from "react";

import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import "./globals.css";
import { ClientProviders } from "@/app/providers";
import FeedbackButton from "@/components/custom/feedback-button";
import { MatomoScript } from "@/components/matomo/matomo-script";
import NavigationTracker from "@/components/matomo/navigation-tracker";

const oswaldSans = Oswald({
  variable: "--font-oswald-sans",
  subsets: ["latin"],
  weight: ["700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Scenario Compass Initiative | IIASA",
    template: "%s | IIASA",
  },
  description: "Navigate Climate Futures with Data-Driven Scenarios",
  openGraph: {
    title: "Scenario Compass Initiative",
    description: "Navigate Climate Futures with Data-Driven Scenarios",
    siteName: "Scenario Compass Initiative",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scenario Compass Initiative",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scenario Compass Initiative",
    description: "Navigate Climate Futures with Data-Driven Scenarios",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswaldSans.variable} ${sourceSans.variable} flex min-h-screen flex-col font-sans`}
      >
        <ClientProviders>
          <>
            {children}
            <Footer />
            <FeedbackButton />
            <NavigationTracker />
          </>
        </ClientProviders>
        <MatomoScript />
      </body>
    </html>
  );
}
