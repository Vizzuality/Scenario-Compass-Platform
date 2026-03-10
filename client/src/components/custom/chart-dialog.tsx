"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function ChartDialog({ open, onOpenChange, title, children }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-h-[90vh] !animate-none flex-col bg-white p-6 !transition-none"
        style={{ width: "90vw", maxWidth: "90vw" }}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <button className="hover:bg-accent w-fit rounded-sm p-1 opacity-70 transition-colors hover:opacity-100">
              <X />
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
