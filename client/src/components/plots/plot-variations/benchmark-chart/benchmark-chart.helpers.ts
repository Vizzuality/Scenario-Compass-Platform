import { BenchmarkDataPoint } from "@/hooks/runs/guided-exploration/figure-three/use-figure-three";
import { DOT_RADIUS } from "./benchmark-chart.config";
import { type BenchmarkGroupKey } from "./benchmark-chart.config";
import { formatNumber } from "@/utils/plots/format-functions";
import { BENCHMARK_GROUP_LABELS } from "./benchmark-chart.config";

const DOT_LANE_HORIZONTAL_PADDING = 2;

export const getRangeByYear = (
  points: BenchmarkDataPoint[],
  year: number,
): { min: number; max: number } | null => {
  const values = points.filter((p) => p.year === year).map((p) => p.pctChange);
  if (!values.length) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
};

export const buildYDomain = (
  allVettedByGroup: BenchmarkDataPoint[][],
  activeYears: number[],
): [number, number] => {
  const allValues: number[] = [0];
  allVettedByGroup.forEach((points) => {
    points.filter((p) => activeYears.includes(p.year)).forEach((p) => allValues.push(p.pctChange));
  });
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const padding = Math.max((max - min) * 0.1, 5);
  return [min - padding, max + padding];
};

const createStableHash = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getDotLaneXPosition = ({
  xBase,
  barWidth,
  point,
  groupKey,
  year,
  laneCount,
}: {
  xBase: number;
  barWidth: number;
  point: BenchmarkDataPoint;
  groupKey: BenchmarkGroupKey;
  year: number;
  laneCount: number;
}): number => {
  const centerX = xBase + barWidth / 2;
  if (laneCount <= 1) return centerX;

  const leftX = xBase + DOT_RADIUS + DOT_LANE_HORIZONTAL_PADDING;
  const rightX = xBase + barWidth - DOT_RADIUS - DOT_LANE_HORIZONTAL_PADDING;
  if (rightX <= leftX) return centerX;

  const laneIndex = createStableHash(`${year}-${groupKey}-${point.runId}`) % laneCount;
  const step = (rightX - leftX) / (laneCount - 1);
  return leftX + step * laneIndex;
};

export const sortDotsForStableLayout = (a: BenchmarkDataPoint, b: BenchmarkDataPoint): number => {
  if (a.pctChange !== b.pctChange) return a.pctChange - b.pctChange;
  return a.runId.localeCompare(b.runId);
};

export const formatPercent = (value: number): string => `${formatNumber(value)}%`;

export const buildDotTooltipHtml = (
  point: BenchmarkDataPoint,
  groupKey: BenchmarkGroupKey,
): string => `
  <ul class="list-disc m-0 pl-4 flex flex-col gap-1 text-black">
    <li><strong>Year:</strong> ${point.year}</li>
    <li><strong>Group:</strong> ${BENCHMARK_GROUP_LABELS[groupKey]}</li>
    <li><strong>Change:</strong> ${formatPercent(point.pctChange)}</li>
  </ul>
`;
