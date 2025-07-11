import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const THEME_VARIANTS = {
  light: "text-foreground",
  dark: "text-background",
} as const;

const SIZE_VARIANTS = {
  "4xl": "font-display text-4xl leading-10 font-bold xl:text-5xl xl:leading-14",
  "5xl": "font-display text-5xl leading-14 font-bold xl:text-7xl xl:leading-21 xl:font-black",
} as const;

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = keyof typeof SIZE_VARIANTS;
type HeadingVariant = keyof typeof THEME_VARIANTS;

interface HeadingProps extends ComponentProps<HeadingElement> {
  as: HeadingElement;
  size: HeadingSize;
  variant?: HeadingVariant;
}

function Heading({
  as: Element,
  size,
  variant = "light",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Element className={cn(SIZE_VARIANTS[size], THEME_VARIANTS[variant], className)} {...props}>
      {children}
    </Element>
  );
}

export { Heading };
