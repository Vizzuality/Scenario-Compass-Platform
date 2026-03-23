"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emailImg from "../../../public/images/email.svg";
import { Heading } from "@/components/custom/heading";
import {
  BOT_FILTER_FIELD,
  EMAIL_FIELD_NAME,
  GROUP_SELECTION,
  IIASA_MAILCHIMP_URL,
} from "@/lib/config/newsletter-constants";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function NewsletterSubscriptionContainer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
      setEmail("");
    }
  };

  return (
    <section className="flex max-w-6xl flex-col items-center px-4 py-16 md:flex-row md:px-10 lg:gap-10 lg:px-20 lg:py-14">
      <Image src={emailImg} height={240} alt="cup of coffee - coming soon" priority />
      <div className="container flex flex-col items-center px-4 py-16">
        <Heading as="h2" size="4xl" variant="light" className="mb-2 text-left">
          Stay up to date on the Scenario Compass
        </Heading>
        <div className="max-w-xl space-y-6">
          <p>
            Please sign up to the Scenario Compass newsletter so that we can inform you of updates
            and new releases of the scenario ensemble!
          </p>
          <div className="flex flex-col gap-5 md:flex-row">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button onClick={handleSignup} className="h-13 px-10 md:h-10">
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
