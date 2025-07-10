"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERNAL_PATHS } from "@/lib/paths";

const excludedFeedbackPaths: string[] = [INTERNAL_PATHS.HOME];

export default function FeedbackButton() {
  const pathname = usePathname();

  if (excludedFeedbackPaths.includes(pathname)) {
    return null;
  }

  return (
    <Button
      asChild
      className="text-background hover:bg-primary border-red-orange bg-red-orange fixed top-36 right-10 box-border origin-top-right -rotate-90 items-center justify-center gap-2 rounded-sm rounded-b-none border border-b-0 p-2 pr-3 hover:text-white"
    >
      <Link href="" aria-label="Provide feedback about this page">
        <span className="text-center font-sans text-base leading-6 font-normal">Feedback</span>
        <MessageSquare size={24} strokeWidth={1.5} aria-hidden="true" role="presentation" />
        <span className="sr-only">Open feedback form to share your thoughts about this page</span>
      </Link>
    </Button>
  );
}
