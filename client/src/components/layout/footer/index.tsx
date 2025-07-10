import { mobilePaths, EXTERNAL_LINKS } from "@/lib/paths";
import Link from "next/link";
import { Dot, Linkedin } from "lucide-react";
import { BlueskyLogoIcon } from "@/assets/icons/bluesky-logo-icon";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center bg-white">
      <div className={"container flex flex-col items-center justify-center px-4 pt-14 pb-2"}>
        <div className={"container flex flex-col"}>
          <div className={"flex flex-col gap-2"}>
            <p
              className={
                "font-display text-center text-2xl leading-10 font-bold text-stone-700 not-italic"
              }
            >
              Scenario Compass Platform
            </p>
            <p className={"text-center font-sans text-xl leading-6 font-normal text-stone-700"}>
              by IIASA
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-7 pt-16 pb-12 text-center md:flex-row md:gap-14 md:pb-16">
            {mobilePaths.map((path, index) => {
              return (
                <Link
                  key={index}
                  {...path}
                  className="font-sans text-base leading-6 font-normal text-stone-700 hover:opacity-60"
                >
                  {path.label}
                </Link>
              );
            })}
          </div>
          <div
            className={
              "flex flex-col items-center justify-between gap-6 border-t border-stone-200 py-14 md:flex-row md:gap-0 md:py-6"
            }
          >
            <div className="order-3 flex flex-col items-center justify-center gap-6 md:order-1 md:flex-row md:gap-4">
              <div className="order-3 font-sans text-sm leading-5 font-normal text-stone-500 md:order-1">
                Copyright 2025 SCP
              </div>
              <Dot className="order-2 text-stone-500" />
              <div className="order-1 flex gap-9 md:order-3 md:gap-4">
                <Link
                  href=""
                  className="text-right font-sans text-sm leading-5 font-normal text-stone-500"
                >
                  Privacy Policy
                </Link>
                <Link
                  href=""
                  className="order-1 text-right font-sans text-sm leading-5 font-normal text-stone-500"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            <Dot className="order-2 text-stone-500 md:hidden" />
            <div
              className={
                "order-1 flex flex-col items-center justify-center gap-5 md:order-2 md:flex-row"
              }
            >
              <div className="flex gap-9 md:gap-5">
                <Link {...EXTERNAL_LINKS.BLUESKY}>
                  <BlueskyLogoIcon />
                </Link>
                <Link {...EXTERNAL_LINKS.LINKEDIN}>
                  <Linkedin className={"text-stone-500"} size={20} strokeWidth={1} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
