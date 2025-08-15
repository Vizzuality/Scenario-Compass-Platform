"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function NavigateToCompareScenariosButton() {
  const searchParams = useSearchParams();
  const href = INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON;
  const currentParams = searchParams.toString();
  const fullHref = currentParams ? `${href}?${currentParams}` : href;

  return (
    <Button asChild className="mt-8">
      <Link href={fullHref} prefetch aria-label="Navigate to compare scenarios page">
        <p>Compare this scenario set to</p>
        <span className="text-xl">+</span>
      </Link>
    </Button>
  );
}
