"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import errorImg from "@/assets/images/server-error.webp";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="flex items-center gap-30">
        <div className="max-w-2xl">
          <p className="mb-4 text-base text-stone-600">ERROR 500</p>

          <h1 className="mb-6 text-5xl font-bold text-stone-900">
            This page isn&#39;t working at the moment
          </h1>

          <p className="mb-6 text-stone-700">
            The server encountered an error and could not complete your request.
          </p>

          <p className="mb-6 text-stone-700">
            How to fix it? We&#39;ve listed some options to help you resolve the issue:
          </p>

          <ol className="text-stone700 mb-8 list-inside list-decimal space-y-4">
            <li>
              <strong>Refresh the page</strong>: Try refreshing the page after clearing your
              browser&#39;s cache and history.
            </li>
            <li>
              <strong>Come back later</strong>: The website may be experiencing a temporary issue.
              Please try again after some time.
            </li>
            <li>
              <strong>Contact us</strong>: If the problem persists, please contact us at
              xxxxx@xxxxx.com and include the error message you received.
            </li>
          </ol>

          <Button onClick={reset}>Try again</Button>
        </div>
        <Image width={500} height={400} alt="This page doesnt exist" src={errorImg} />
      </div>
    </div>
  );
}
