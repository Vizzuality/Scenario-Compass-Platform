"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface ExploreScenariosButtonProps {
  href: string;
}

export default function ExploreScenariosButton({ href }: ExploreScenariosButtonProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentParams = searchParams.toString();
  const fullHref = currentParams ? `${href}?${currentParams}` : href;

  if (pathname === href) {
    return (
      <Button
        size="lg"
        className="w-full flex-1 text-base leading-5"
        variant="tertiary"
        disabled
        aria-current="page"
      >
        Explore Scenarios
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className="w-full flex-1 text-base leading-5" variant="tertiary">
      <Link href={fullHref} prefetch aria-label="Navigate to explore scenarios page">
        Explore Scenarios
      </Link>
    </Button>
  );
}
