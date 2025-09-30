"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";

export default function ClearFilterButton() {
  const { clearAll: clearAllBase } = useBaseUrlParams();
  const { clearAll: clearAllFilter } = useFilterUrlParams();

  const handleClearAll = () => {
    Promise.all([clearAllBase(), clearAllFilter()]).then(() => {
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
