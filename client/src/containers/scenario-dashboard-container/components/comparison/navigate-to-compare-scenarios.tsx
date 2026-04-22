"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function NavigateToCompareScenarios() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    const currentParams = searchParams.toString();
    const comparisonUrl = `${INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON}?${currentParams}`;
    router.push(comparisonUrl);
  };

  return (
    <Button className="mt-8" size="lg" onClick={handleClick} disabled={isNavigating}>
      {isNavigating ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Preparing the comparison...
        </span>
      ) : (
        <span>Compare this scenario set</span>
      )}
    </Button>
  );
}
