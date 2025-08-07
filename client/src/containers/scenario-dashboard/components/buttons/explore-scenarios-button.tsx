"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function ExploreScenariosButton() {
  const searchParams = useSearchParams();
  const href = INTERNAL_PATHS.SCENARIO_DASHBOARD_EXPLORATION;
  const currentParams = searchParams.toString();
  const fullHref = currentParams ? `${href}?${currentParams}` : href;

  return (
    <Button asChild size="lg" className="w-full flex-1 text-base leading-5" variant="tertiary">
      <Link href={fullHref} prefetch aria-label="Navigate to explore scenarios page">
        Explore Scenarios
      </Link>
    </Button>
  );
}
