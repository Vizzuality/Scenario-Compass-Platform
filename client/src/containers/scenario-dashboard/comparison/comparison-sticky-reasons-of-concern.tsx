"use client";

import { useEffect, useRef, useState } from "react";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { cn } from "@/lib/utils";
import ControlledMultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags-controlled";

interface ComparisonStickyFlagsProps {
  leftShowMetric: boolean;
  rightShowMetric: boolean;
  leftResult: RunPipelineReturn;
  rightResult: RunPipelineReturn;
  prefix: string;
}

export default function ComparisonStickyFlags({
  leftShowMetric,
  rightShowMetric,
  leftResult,
  rightResult,
  prefix,
}: ComparisonStickyFlagsProps) {
  const [isStuck, setIsStuck] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  if (!leftShowMetric && !rightShowMetric) return null;

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        className={cn(
          "sticky top-0 z-10 transition-all duration-150",
          isStuck && "border-b bg-white shadow-sm",
        )}
      >
        <div className="grid grid-cols-2 gap-0">
          <div className={cn("border-r pt-6 pr-4 pb-4", isStuck && "pl-4")}>
            {leftShowMetric && (
              <ControlledMultiRunScenarioFlags
                result={leftResult}
                value={accordionValue}
                onValueChange={setAccordionValue}
              />
            )}
          </div>
          <div className={cn("pt-6 pb-4 pl-4", isStuck && "pr-4")}>
            {rightShowMetric && (
              <ControlledMultiRunScenarioFlags
                result={rightResult}
                prefix={prefix}
                value={accordionValue}
                onValueChange={setAccordionValue}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
