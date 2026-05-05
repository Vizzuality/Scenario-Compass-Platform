"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";
import { cn } from "@/lib/utils";
import { Route } from "next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  className?: string;
}

export default function SeeInEnsembleButton({ className }: Props) {
  const { selectedRunId } = useSelectedRunParam();

  const explorerPath = {
    pathname: "/scenario-dashboard" as Route,
    query: selectedRunId ? { selectedRunId } : {},
  };

  const isDisabled = !selectedRunId;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("inline-block", className)}>
          <Button
            disabled={isDisabled}
            variant="ghost"
            asChild={!isDisabled}
            className="h-12 gap-2 px-4 text-sm font-bold text-stone-700 hover:bg-stone-100"
          >
            {!isDisabled ? (
              <Link href={explorerPath}>
                <LayoutDashboard size={20} className="text-stone-600" />
                <span>See in Ensemble Context</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 opacity-50">
                <LayoutDashboard size={20} className="text-stone-600" />
                <span>See in Ensemble Context</span>
              </div>
            )}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {isDisabled
          ? "No scenario selected to view"
          : "View this scenario compared to the full ensemble"}
      </TooltipContent>
    </Tooltip>
  );
}
