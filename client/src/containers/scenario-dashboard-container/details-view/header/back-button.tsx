"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <Button
        onClick={handleBack}
        size="lg"
        className="text-base leading-6 font-normal"
        variant="ghost"
      >
        <ArrowLeft size={16} /> Back
      </Button>
    </div>
  );
}
