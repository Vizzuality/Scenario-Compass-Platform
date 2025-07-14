"use client";

import { useScenarioDashboardUrlParams } from "@/containers/scenario-dashboard-page/url-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClearFilterButton() {
  const { clearAll } = useScenarioDashboardUrlParams();

  return (
    <Button
      variant="ghost"
      onClick={clearAll}
      className={cn(
        "text-beige-light text-sm leading-5 font-normal text-nowrap underline underline-offset-2",
        "hover:text-beige-light hover:bg-transparent",
      )}
      aria-label="Clear all filters"
    >
      Clear all
    </Button>
  );
}
