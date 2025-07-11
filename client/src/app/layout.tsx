import { ReactNode } from "react";

import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import "./globals.css";
import { ClientProviders } from "@/app/providers";
import FeedbackButton from "@/components/custom/feedback-button";

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
  title: "Scenario Compass Platform | IIASA",
  description: "[TBD]",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswaldSans.variable} ${sourceSans.variable} font-sans`}>
        <ClientProviders>
          <>
            {children}
            <Footer />
            <FeedbackButton />
          </>
        </ClientProviders>
      </body>
    </html>
  );
}
