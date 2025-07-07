import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const themeClasses = {
  light: "text-foreground",
  dark: "text-background",
};

type Element = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

type Size = "base" | "lg" | "xl" | "4xl" | "5xl";

interface TitleProps {
  children: ReactNode;
  className?: string;
  variant?: "dark" | "light";
  as: Element;
  size: Size;
}

const sizeClasses: Record<Partial<Size>, string> = {
  "5xl": "font-display text-5xl leading-14 font-bold xl:text-7xl xl:leading-21 xl:font-black",
  "4xl": "font-display text-4xl leading-10 font-bold xl:text-5xl xl:leading-14",
  xl: "font-sans text-xl leading-7",
  lg: "font-sans text-lg leading-7",
  base: "font-sans text-base leading-6 font-normal tracking-[0.64px] uppercase",
};

function Text({ children, className, variant = "light", as, size }: TitleProps) {
  const classes = cn(sizeClasses[size], themeClasses[variant], className);
  const Element = as;
  return <Element className={classes}>{children}</Element>;
}

export { Text };
