"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONSENT_KEY = "user-consent-timestamp";
const DELAY = 24 * 60 * 60 * 1000;
const BOT_FILTER_FIELD = "b_4a7b399fd5c39ff77e8f1e7dc_392b395289";
const GROUP_SELECTION = "group[11693][65536]";
const IIASA_MAILCHIMP_URL =
  "https://iiasa.us5.list-manage.com/subscribe/post?u=4a7b399fd5c39ff77e8f1e7dc&id=392b395289&f_id=006ed2e4f0";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function EmbargoPopUp() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const consentTimestamp = localStorage.getItem(CONSENT_KEY);

    if (!consentTimestamp) {
      setOpen(true);
      return;
    }

    const consentDate = new Date(parseInt(consentTimestamp));
    const now = new Date();
    const daysPassed = now.getTime() - consentDate.getTime();

    if (daysPassed >= DELAY) {
      setOpen(true);
    }
  }, []);

  const saveConsent = () => {
    localStorage.setItem(CONSENT_KEY, Date.now().toString());
    setOpen(false);
  };

  const handleSkip = () => {
    saveConsent();
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("EMAIL", email);
      formData.append(GROUP_SELECTION, "1");
      formData.append(BOT_FILTER_FIELD, "");

      await fetch(IIASA_MAILCHIMP_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      console.log("Signing up with:", email);
      saveConsent();
    } catch (error) {
      console.error("Subscription error:", error);
      saveConsent();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <b className="text-2xl">Embargo Notification</b>
        <p>
          This website contains scenario data related to unpublished research and a manuscript under
          review.
        </p>
        <p>
          It is ok to use the data for scientific research, but please do not share or distribute
          the data without permission from the Scenario Compass Initiative.
        </p>
        <Button onClick={handleSkip} variant="outline" className="px-10" size="lg">
          Got it, continue to the dashboard
        </Button>
        <strong className="mt-2">Stay up to date on the Scenario Compass</strong>
        <p>
          Please sign up to the Scenario Compass newsletter so that we can inform you of updates and
          new releases of the scenario ensemble!
        </p>

        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={handleSignup}
          disabled={!isValidEmail(email) || isSubmitting}
          className="px-10"
          size="lg"
        >
          {isSubmitting ? "Signing up..." : "Sign up and continue to the dashboard"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
