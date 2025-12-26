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
        "mt-1 text-center text-lg leading-7 font-normal not-italic",
        "hover:opacity-60",
        isActive ? "border-b-2 border-current" : "border-b-2 border-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
