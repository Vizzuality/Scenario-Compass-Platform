"use client";

import { ExtendedRun } from "@/types/data/run";
import Link from "next/link";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";
import { getRunColor } from "@/utils/plots/colors-functions";

interface Props {
  runs?: ExtendedRun[];
  prefix?: string;
  className?: string;
}

export default function RunHeader({ runs, prefix, className = "" }: Props) {
  const { selectedRunId, setSelectedRunId } = useSelectedRunParam(prefix);
  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const { selectedFlags } = useScenarioFlagsSelection(prefix);

  if (!runs || !selectedRunId) return null;

  const selectedRun = runs.find((r) => r.runId === selectedRunId);
  if (!selectedRun) return null;

  const abbrev = getCategoryAbbrev(selectedRun.flagCategory);
  const runColor = getRunColor(selectedRun, abbrev ? [abbrev] : selectedFlags, true);
  const detailsUrl = buildRunDetailsUrl(selectedRun);

  return (
    <div
      className={cn(
        "@container relative flex flex-col gap-4 rounded-lg border border-stone-600 p-4",
        className,
      )}
    >
      <Button
        variant="ghost"
        onClick={() => setSelectedRunId(null)}
        className="absolute top-3 right-3 flex size-8 shrink-0 items-center justify-center rounded-full p-0 transition-colors"
        title="Clear selection"
      >
        <X size={16} strokeWidth={2.5} />
      </Button>

      <div className="flex flex-col gap-4 @sm:flex-row @sm:items-end @sm:justify-between @sm:pr-0">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg leading-tight font-semibold text-stone-800">
              Selected Scenario
            </h3>
            <div
              className="size-2.5 shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: runColor }}
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm font-medium">
            <span className="text-stone-500">Scenario:</span>
            <span className="text-stone-800">{selectedRun.scenarioName}</span>

            <span className="text-stone-500">Model:</span>
            <span className="text-stone-800">{selectedRun.modelName}</span>
          </div>
        </div>

        <Link
          href={detailsUrl}
          target="_blank"
          className="border-primary bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-3 py-1.5 text-xs font-bold transition-colors"
        >
          See Scenario details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
