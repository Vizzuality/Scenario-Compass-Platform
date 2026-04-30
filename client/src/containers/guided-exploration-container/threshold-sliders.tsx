"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ThresholdBand } from "@/lib/config/guided-exploration/capacity-thresholds";

interface Props {
  thresholds: ThresholdBand;
  onHighLowerChange: (v: number) => void;
  onHighUpperChange: (v: number) => void;
  onMediumLowerChange: (v: number) => void;
  onMediumUpperChange: (v: number) => void;
  min: number;
  max: number;
  unit?: string;
}

export function ThresholdSliders({
  thresholds,
  onHighLowerChange,
  onHighUpperChange,
  onMediumLowerChange,
  onMediumUpperChange,
  min,
  max,
  unit = "GW",
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border px-4 py-6">
      {thresholds.high.upper !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E33021]" />
            High upper: {thresholds.high.upper.toFixed(0)} {unit}
          </Label>
          <Slider
            min={min}
            max={max}
            step={10}
            value={[thresholds.high.upper]}
            onValueChange={([v]) => onHighUpperChange(v)}
          />
        </div>
      )}

      {thresholds.high.lower !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E33021]" />
            High lower: {thresholds.high.lower.toFixed(0)} {unit}
          </Label>
          <Slider
            min={min}
            max={max}
            step={10}
            value={[thresholds.high.lower]}
            onValueChange={([v]) => onHighLowerChange(v)}
          />
        </div>
      )}

      {thresholds.medium.upper !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ED8936]" />
            Medium upper: {thresholds.medium.upper.toFixed(0)} {unit}
          </Label>
          <Slider
            min={min}
            max={max}
            step={10}
            value={[thresholds.medium.upper]}
            onValueChange={([v]) => onMediumUpperChange(v)}
          />
        </div>
      )}

      {thresholds.medium.lower !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ED8936]" />
            Medium lower: {thresholds.medium.lower.toFixed(0)} {unit}
          </Label>
          <Slider
            min={min}
            max={max}
            step={10}
            value={[thresholds.medium.lower]}
            onValueChange={([v]) => onMediumLowerChange(v)}
          />
        </div>
      )}
    </div>
  );
}
