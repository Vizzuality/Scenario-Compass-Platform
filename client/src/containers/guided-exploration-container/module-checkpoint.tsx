"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ModuleCheckpointComponent = () => {
  const [revealAnswer, setRevealAnswer] = useState(false);

  return (
    <div className="bg-lilac rounded-lg p-8">
      <p className="mb-3 font-serif font-bold tracking-widest uppercase">Checkpoint</p>
      <p className="mb-4 text-lg">
        Before exploring how these assessments affect benchmarks, a quick check: What is the
        difference between a feasibility flag and a sustainability flag?
      </p>

      <Button onClick={() => setRevealAnswer((prev) => !prev)}>
        {revealAnswer ? "Hide answer" : "Reveal answer"}
      </Button>

      {revealAnswer && (
        <div className="animate-in fade-in mt-6 border-t pt-6 italic duration-500">
          A feasibility flag asks whether a scenario&apos;s requirements are physically achievable.
          A sustainability flag asks whether achieving it would respect planetary limits.
        </div>
      )}
    </div>
  );
};
