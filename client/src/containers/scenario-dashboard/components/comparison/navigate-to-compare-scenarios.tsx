"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";

export default function NavigateToCompareScenarios() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const currentParams = searchParams.toString();
    const comparisonUrl = `${INTERNAL_PATHS.SCENARIO_DASHBOARD_COMPARISON}?${currentParams}`;
    router.push(comparisonUrl);
  };

  return (
    <Button className="mt-8" onClick={handleClick}>
      <span>Compare this scenario set</span>
    </Button>
  );
}
