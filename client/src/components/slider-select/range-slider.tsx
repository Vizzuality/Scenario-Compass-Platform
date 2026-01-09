import { Slider } from "@/components/ui/slider";
import React from "react";

interface Props {
  range: [number, number];
  handleRangeChange: (values: number[]) => void;
  min: number;
  max: number;
  step: number;
  type?: "percentual" | "range";
}

export default function RangeSlider({
  range,
  handleRangeChange,
  min,
  max,
  step,
  type = "percentual",
}: Props) {
  return (
    <div className="mt-3">
      <div className="flex gap-2 py-1.5">
        <div className="text-primary rounded-md border border-stone-400 px-4 py-1.5 text-sm font-bold">
          {range[0]}
          {type === "percentual" && "%"}
        </div>
        <Slider
          value={range}
          onValueChange={handleRangeChange}
          max={max}
          min={min}
          step={step}
          minStepsBetweenThumbs={1}
          className="w-full"
        />
        <div className="text-primary rounded-md border border-stone-400 px-4 py-1.5 text-sm font-bold">
          {range[1]}
          {type === "percentual" && "%"}
        </div>
      </div>
    </div>
  );
}
