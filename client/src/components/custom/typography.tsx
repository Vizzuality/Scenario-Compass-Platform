import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  variant?: "dark" | "light";
}

function Title({ children, className, variant = "dark" }: TypographyProps) {
  const variantClasses = {
    dark: "text-stone-900",
    light: "text-beige-light",
  };

  return (
    <h1
      className={cn(
        "font-display text-5xl leading-14 font-bold md:text-7xl md:leading-21 md:font-black",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </h1>
  );
}

function Title2({ children, className, variant = "dark" }: TypographyProps) {
  const variantClasses = {
    dark: "text-stone-900",
    light: "text-beige-light",
  };

  return (
    <h2
      className={cn(
        "font-display text-4xl leading-10 font-bold md:text-5xl md:leading-14",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </h2>
  );
}

function Subtitle({ children, className, variant = "dark" }: TypographyProps) {
  const variantClasses = {
    dark: "text-stone-900",
    light: "text-beige-light",
  };

  return (
    <p
      className={cn("font-sans text-xl leading-7 font-normal", variantClasses[variant], className)}
    >
      {children}
    </p>
  );
}

function AnteTitle({ children, className, variant = "dark" }: TypographyProps) {
  const variantClasses = {
    dark: "text-stone-900",
    light: "text-beige-light text-center",
  };

  return (
    <span
      className={cn(
        "font-sans text-base leading-6 font-normal tracking-[0.64px] uppercase",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

function BodyText({ children, className, variant = "dark" }: TypographyProps) {
  const variantClasses = {
    dark: "text-stone-700",
    light: "text-beige-light",
  };

  return (
    <p
      className={cn("font-sans text-lg leading-7 font-normal", variantClasses[variant], className)}
    >
      {children}
    </p>
  );
}

export { Title, Subtitle, AnteTitle, Title2, BodyText };
