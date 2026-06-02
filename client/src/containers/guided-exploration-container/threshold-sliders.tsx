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
  onHighLowerCommit: (v: number) => void;
  onHighUpperCommit: (v: number) => void;
  onMediumLowerCommit: (v: number) => void;
  onMediumUpperCommit: (v: number) => void;
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
  onHighLowerCommit,
  onHighUpperCommit,
  onMediumLowerCommit,
  onMediumUpperCommit,
  min,
  max,
  unit = "GW",
}: Props) {
  const getMin = (...values: Array<number | undefined>): number =>
    Math.max(min, ...values.filter((value): value is number => value !== undefined));
  const getMax = (...values: Array<number | undefined>): number =>
    Math.min(max, ...values.filter((value): value is number => value !== undefined));

  const highUpperMin = getMin(thresholds.high.lower, thresholds.medium.upper);
  const highLowerMax = getMax(thresholds.medium.lower, thresholds.high.upper);
  const mediumUpperMin = getMin(thresholds.medium.lower);
  const mediumUpperMax = getMax(thresholds.high.upper);
  const mediumLowerMin = getMin(thresholds.high.lower);
  const mediumLowerMax = getMax(thresholds.medium.upper, thresholds.high.upper);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border px-4 py-6">
      {thresholds.high.upper !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E33021]" />
            High upper: {thresholds.high.upper.toFixed(1)} {unit}
          </Label>
          <Slider
            key={`${thresholds.name}-high-upper`}
            min={highUpperMin}
            max={max}
            step={10}
            value={[thresholds.high.upper]}
            onValueChange={([v]) => onHighUpperChange(v)}
            onValueCommit={([v]) => onHighUpperCommit(v)}
          />
        </div>
      )}

      {thresholds.high.lower !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E33021]" />
            High lower: {thresholds.high.lower.toFixed(1)} {unit}
          </Label>
          <Slider
            key={`${thresholds.name}-high-lower`}
            min={min}
            max={highLowerMax}
            step={10}
            value={[thresholds.high.lower]}
            onValueChange={([v]) => onHighLowerChange(v)}
            onValueCommit={([v]) => onHighLowerCommit(v)}
          />
        </div>
      )}

      {thresholds.medium.upper !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ED8936]" />
            Medium upper: {thresholds.medium.upper.toFixed(1)} {unit}
          </Label>
          <Slider
            key={`${thresholds.name}-medium-upper`}
            min={mediumUpperMin}
            max={mediumUpperMax}
            step={10}
            value={[thresholds.medium.upper]}
            onValueChange={([v]) => onMediumUpperChange(v)}
            onValueCommit={([v]) => onMediumUpperCommit(v)}
          />
        </div>
      )}

      {thresholds.medium.lower !== undefined && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ED8936]" />
            Medium lower: {thresholds.medium.lower.toFixed(2)} {unit}
          </Label>
          <Slider
            key={`${thresholds.name}-medium-lower`}
            min={mediumLowerMin}
            max={mediumLowerMax}
            step={10}
            value={[thresholds.medium.lower]}
            onValueChange={([v]) => onMediumLowerChange(v)}
            onValueCommit={([v]) => onMediumLowerCommit(v)}
          />
        </div>
      )}
    </div>
  );
}
