"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BOT_FILTER_FIELD,
  EMAIL_FIELD_NAME,
  GROUP_SELECTION,
  IIASA_MAILCHIMP_URL,
} from "@/lib/config/newsletter-constants";
import Link from "next/link";

const CONSENT_KEY = "user-consent-timestamp";
const DELAY = 24 * 60 * 60 * 1000;

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
      formData.append(EMAIL_FIELD_NAME, email);
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
        className="z-9999 max-h-[90vh] w-[95vw] max-w-lg overflow-y-auto bg-white p-5 sm:p-6"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-xl font-bold sm:text-2xl">Embargo Notification</h2>
            <div className="space-y-2 text-sm text-stone-700 sm:text-base">
              <p>
                This website contains scenario data associated with unpublished research and a
                manuscript currently under peer review.
              </p>
              <p>
                The data may be used for scientific research purposes. However, users must strictly
                adhere to the applicable{" "}
                <Link
                  href="https://www.nature.com/nature-portfolio/editorial-policies/preprints-and-conference-proceedings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy font-medium underline"
                >
                  Nature editorial policies and embargo rules
                </Link>{" "}
                until the manuscript has been formally published.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black sm:text-base">
              Please use the following citation when using the data:
            </p>
            <div className="border-burgundy space-y-4 border-l-2 bg-gray-50 p-4 text-sm">
              <div>
                <p className="mb-1 text-black">
                  <em>
                    "Mitigation benchmarks from the 2025 community update of global emissions
                    pathways"
                  </em>{" "}
                  (Riahi et al., submitted).
                </p>
                <Link
                  href="https://doi.org/10.21203/rs.3.rs-8891091/v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy break-all underline"
                >
                  https://doi.org/10.21203/rs.3.rs-8891091/v1
                </Link>
              </div>
              <div>
                <p className="mb-1 text-black">
                  <em>"Scenario Compass Initiative - Pathways Ensemble 2025"</em> (Huppmann et al.)
                  Zenodo.
                </p>
                <Link
                  href="https://doi.org/10.5281/zenodo.18598250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy break-all underline"
                >
                  https://doi.org/10.5281/zenodo.18598250
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold sm:text-lg">Stay up to date</h3>
              <p className="text-sm text-stone-700 sm:text-base">
                Please sign up to the Scenario Compass newsletter so that we can inform you of
                updates and new releases of the scenario ensemble!
              </p>
            </div>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-base"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <Button onClick={handleSkip} variant="outline" className="w-full flex-1 sm:w-auto">
              Got it, continue
            </Button>
            <Button
              onClick={handleSignup}
              disabled={!isValidEmail(email) || isSubmitting}
              className="w-full flex-1 sm:w-auto"
            >
              {isSubmitting ? "Signing up..." : "Sign up and continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
