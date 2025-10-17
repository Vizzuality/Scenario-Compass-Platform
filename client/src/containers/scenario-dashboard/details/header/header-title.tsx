"use client";

import { useState } from "react";
import { CircleCheck, Share2 } from "lucide-react";
import BackButton from "@/containers/scenario-dashboard/details/header/back-button";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function HeaderTitle() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setOpen(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <>
      <BackButton />
      <div className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-900">Scenario Details</h1>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="aspect-square h-12" onClick={handleShare}>
              <Share2 />
            </Button>
          </TooltipTrigger>
          {copied ? (
            <TooltipContent withArrow={false} className="flex gap-1.5 border bg-white shadow-md">
              <CircleCheck size={20} className="text-green-400" />
              <p className="text-sm text-black">Link copied</p>
            </TooltipContent>
          ) : (
            <TooltipContent>Copy to clipboard</TooltipContent>
          )}
        </Tooltip>
      </div>
    </>
  );
}
