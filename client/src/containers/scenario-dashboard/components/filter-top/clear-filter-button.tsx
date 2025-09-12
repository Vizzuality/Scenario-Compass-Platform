"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";

export default function ClearFilterButton() {
  const { clearAll } = useScenarioDashboardUrlParams();

  const handleClearAll = () => {
    clearAll().then(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClearAll}
      className={cn(
        "text-primary text-sm leading-5 font-normal text-nowrap underline underline-offset-2",
        "hover:text-primary hover:bg-transparent",
      )}
    >
      Clear all filters
    </Button>
  );
}
