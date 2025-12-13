import Link from "next/link";
import { Menu, X } from "lucide-react";

import { desktopPaths, mobilePaths, INTERNAL_PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { ActiveLink } from "@/components/layout/navbar/active-link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import logoDark from "@/assets/logo/logo-dark.svg";
import logoLight from "@/assets/logo/logo-light.svg";
import logoLilac from "@/assets/logo/logo-lilac.svg";
import Image from "next/image";

interface Props {
  className?: string;
  theme: "dark" | "light";
  sheetTheme: "burgundy" | "lilac" | "white";
}

const themeStyles = {
  dark: "text-beige-light",
  light: "text-stone-900",
};

const sheetThemeStyles = {
  burgundy: "bg-burgundy text-beige-light",
  lilac: "bg-lilac text-stone-900",
  white: "bg-white text-stone-900",
};

const getLogoSvg = (theme: string) => {
  switch (theme) {
    case "light":
      return logoLight;
    case "dark":
      return logoDark;
    case "lilac":
      return logoLilac;
    default:
      return logoDark;
  }
};

const Logo = ({ className, theme }: { className?: string; theme: string }) => {
  const logoSrc = getLogoSvg(theme);
  const textColor = theme === "light" ? "text-burgundy" : "text-beige-light";

  return (
    <Link href={INTERNAL_PATHS.HOME} className={cn(className, "flex h-fit gap-2")}>
      <Image src={logoSrc} alt="IIASA Logo" />
      <div className={textColor}>
        <span className="font-display text-2xl leading-10">Scenario Compass Initiative</span>
      </div>
    </Link>
  );
};

export function Navbar({ className, theme, sheetTheme }: Props) {
  const navStyles = themeStyles[theme];
  const sheetStyles = sheetThemeStyles[sheetTheme];

  return (
    <nav className={cn("h-14 w-full bg-transparent lg:h-21", className)}>
      <div
        className={cn("container mx-auto flex h-full items-center justify-between px-4", navStyles)}
      >
        <Logo theme={theme} />

        <div className="hidden items-center gap-10 xl:flex">
          {desktopPaths.map((link, index) => (
            <ActiveLink key={index} {...link} className="text-lg">
              {link.label}
            </ActiveLink>
          ))}
        </div>

        <div className="flex xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle>Mobile Menu Sheet</SheetTitle>
            <SheetContent className={cn("w-full gap-6 border-none px-4 py-2", sheetStyles)}>
              <div className="flex items-center justify-between">
                <Logo theme={sheetStyles} />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X />
                    <span className="sr-only">Close Menu</span>
                  </Button>
                </SheetClose>
              </div>

              <div className="flex flex-col items-start gap-4">
                {mobilePaths.map((link, index) => (
                  <SheetClose key={index} asChild className="py-3">
                    <ActiveLink {...link}>{link.label}</ActiveLink>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
