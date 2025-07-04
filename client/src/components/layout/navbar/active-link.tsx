"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

export function ActiveLink({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const hrefAsString = href.toString();

  const isActive = pathname.startsWith(hrefAsString) && hrefAsString !== "/";

  return (
    <Link
      href={href}
      className={cn(
        "text-center font-sans text-lg leading-7 font-normal not-italic",
        "hover:opacity-80",
        "underline-offset-12",
        isActive ? "underline" : "",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
