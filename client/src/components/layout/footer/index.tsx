import { mobilePaths, EXTERNAL_LINKS, INTERNAL_PATHS } from "@/lib/paths";
import Link from "next/link";
import { Dot, Linkedin } from "lucide-react";
import { BlueskyLogoIcon } from "@/assets/icons/bluesky-logo-icon";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center bg-white">
      <div className="container flex flex-col items-center justify-center px-4 pt-14 pb-2">
        <div className="container flex flex-col">
          <div className="flex flex-col gap-2">
            <p
              className={
                "font-display text-center text-2xl leading-10 font-bold text-stone-700 not-italic"
              }
            >
              The Scenario Compass
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-10 pt-16 lg:flex-row">
            <img
              src="/images/logos/logo_iamc.png"
              className="pointer-events-none h-14 w-auto select-none lg:h-18 lg:w-auto"
              alt="Integrated Assessment Modeling Consortium Logo"
            />
            <img
              src="/images/logos/logo_bef.svg"
              className="pointer-events-none h-14 w-auto select-none lg:h-18 lg:w-auto"
              alt="Bezos Earth Found Logo"
            />
            <img
              src="/images/logos/logo_iiasa.png"
              className="pointer-events-none h-14 w-auto select-none lg:h-18 lg:w-auto"
              alt="International Institute for Applied Systems Analysis Logo"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-7 pt-16 pb-12 text-center lg:flex-row lg:gap-14 lg:pb-16">
            {mobilePaths.map((path, index) => {
              return (
                <Link
                  key={index}
                  {...path}
                  className="text-base leading-6 font-normal text-stone-700 hover:opacity-60"
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
              <div
                className="order-3 text-sm leading-6 font-normal text-stone-500 md:order-1"
                role="contentinfo"
                aria-label="Copyright information"
              >
                © 2026 Scenario Compass Initiative
              </div>
              <Dot className="order-2 text-stone-500" />
              <div className="order-1 flex gap-9 md:order-3 md:gap-4">
                <Link
                  {...EXTERNAL_LINKS.TERMS_OF_USE}
                  className="text-right text-sm leading-6 font-normal text-stone-500"
                >
                  Terms of Use
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
                <Link
                  {...EXTERNAL_LINKS.CONTACT}
                  className="text-sm leading-6 font-normal text-stone-700 hover:opacity-60"
                >
                  Contact
                </Link>
                <Dot className="hidden text-stone-500 md:inline" />
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
