import Link from "next/link";
import { Menu, X } from "lucide-react";

import { desktopPaths, mobilePaths, PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { ActiveLink } from "@/components/layout/navbar/active-link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

interface Props {
  className?: string;
  theme?: "default" | "burgundy" | "lilac";
}

const themeStyles = {
  default: {
    sheet: "bg-white text-stone-900",
    text: "text-stone-900",
  },
  burgundy: {
    sheet: "bg-burgundy text-beige-light",
    text: "text-beige-light",
  },
  lilac: {
    sheet: "bg-lilac text-stone-900",
    text: "text-stone-900",
  },
};

const Logo = ({ className }: { className?: string }) => (
  <Link href={PATHS.HOME} className={className}>
    <span className="font-display mr-2 text-xl leading-10 font-bold">SCP</span>
    <span className="font-sans text-lg font-normal">by IIASA</span>
  </Link>
);

export function Navbar({ className, theme = "default" }: Props) {
  const styles = themeStyles[theme];

  return (
    <nav className={cn("h-14 w-full bg-transparent lg:h-21", className)}>
      <div
        className={cn(
          "container mx-auto flex h-full items-center justify-between px-4 lg:px-10",
          styles.text,
        )}
      >
        <Logo />

        <div className="hidden items-center gap-10 lg:flex">
          {desktopPaths.map((link) => (
            <ActiveLink key={link.href} href={link.href} className="text-lg">
              {link.label}
            </ActiveLink>
          ))}
        </div>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle>Mobile Menu Sheet</SheetTitle>
            <SheetContent className={cn("w-full gap-6 border-none px-4 py-2", styles.sheet)}>
              <div className="flex items-center justify-between">
                <Logo />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="!h-6 !w-6" />
                    <span className="sr-only">Close Menu</span>
                  </Button>
                </SheetClose>
              </div>

              <div className="flex flex-col items-start gap-4">
                {mobilePaths.map((link) => (
                  <SheetClose key={link.href} asChild className="py-3">
                    <ActiveLink href={link.href}>{link.label}</ActiveLink>
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
