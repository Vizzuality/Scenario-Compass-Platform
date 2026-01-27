// components/consent-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "user-consent-timestamp";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function EmbargoPopUp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consentTimestamp = localStorage.getItem(CONSENT_KEY);

    if (!consentTimestamp) {
      setOpen(true);
      return;
    }

    const consentDate = new Date(parseInt(consentTimestamp));
    const now = new Date();
    const daysPassed = now.getTime() - consentDate.getTime();

    if (daysPassed >= SEVEN_DAYS_MS) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, Date.now().toString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <b className="text-2xl">Embargo Notification</b>
        <p>
          This website contains scenario data related to unpublished research associated with a
          manuscript under review. <br /> Please do not share, distribute, or cite without
          permission from the Scenario Compass Initiative.
        </p>
        <div className="flex flex-col items-center gap-3 pt-4">
          <Button onClick={handleAccept} className="w-fit px-10" size="lg">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
