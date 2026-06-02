import { FigureThreeData } from "@/hooks/guided-exploration/figure-three/use-figure-three";

export type BenchmarkGroupKey = keyof Pick<FigureThreeData, "groupA" | "groupB">;

export interface BenchmarkMargin {
  TOP: number;
  RIGHT: number;
  BOTTOM: number;
  LEFT: number;
}

export interface BenchmarkGroupColors {
  range: string;
  rangeBorder: string;
  dot: string;
}

export const BASELINE_YEAR = 2020;

export const BENCHMARK_GROUP_KEYS: BenchmarkGroupKey[] = ["groupA", "groupB"];

export const BENCHMARK_GROUP_LABELS: Record<BenchmarkGroupKey, string> = {
  groupA: "GW3",
  groupB: "GW2+GW1",
};

export const BENCHMARK_COLORS: Record<BenchmarkGroupKey, BenchmarkGroupColors> = {
  groupA: {
    range: "rgba(99, 132, 220, 0.25)",
    rangeBorder: "rgba(99, 132, 220, 0.5)",
    dot: "#4266C8",
  },
  groupB: {
    range: "rgba(134, 193, 134, 0.25)",
    rangeBorder: "rgba(134, 193, 134, 0.5)",
    dot: "#3A9B3A",
  },
};

export const MARGIN: BenchmarkMargin = {
  TOP: 40,
  RIGHT: 48,
  BOTTOM: 30,
  LEFT: 65,
};

export const DOT_RADIUS = 4;
export const DOT_FILL_OPACITY = 0.85;
export const DOT_STROKE_WIDTH = 0.5;

export const RANGE_BAR_RADIUS = 2;
export const RANGE_BAR_STROKE_WIDTH = 1;
export const MIN_RANGE_BAR_HEIGHT = 2;
export const UNVETTED_WHISKER_STROKE_WIDTH = 2;
export const UNVETTED_WHISKER_CAP_WIDTH_RATIO = 0.45;
export const UNVETTED_WHISKER_DASH_ARRAY = "3,3";

export const ZERO_LINE_COLOR = "#374151";
export const ZERO_LINE_STROKE_WIDTH = 1.5;
export const ZERO_LINE_DASH_ARRAY = "6,4";

export const Y_AXIS_LABEL = "% compared to 2020";
export const Y_AXIS_LABEL_OFFSET = -52;

export const HOVER_GUIDE_LINE_COLOR = "#111827";
export const HOVER_GUIDE_LINE_WIDTH = 1.25;
export const HOVER_GUIDE_LINE_DASH_ARRAY = "4,4";
export const HOVER_GUIDE_LINE_OPACITY = 0.85;

export const HOVER_RANGE_FILL_OPACITY = 0.08;
export const HOVER_RANGE_STROKE_WIDTH = 2;

export const HOVER_LABEL_FONT_SIZE = "11px";
export const HOVER_LABEL_TEXT_COLOR = "white";
export const HOVER_LABEL_STROKE_COLOR = "#ffffff";
export const HOVER_LABEL_STROKE_WIDTH = 4;
export const HOVER_LABEL_RIGHT_OFFSET = 6;

export const HOVER_PILL_LINE_GAP = 4;
export const HOVER_PILL_CHART_PADDING = 4;

export const HOVER_PILL_PADDING_X = 8;
export const HOVER_PILL_PADDING_Y = 5;
export const HOVER_PILL_RADIUS = 10;
export const HOVER_PILL_BACKGROUND_COLOR = "#000000";
export const HOVER_PILL_BACKGROUND_OPACITY = 0.85;

export const HOVER_HEADER_LABEL_Y = 14;
export const HOVER_MAX_LABEL_Y_OFFSET = -6;
export const HOVER_MIN_LABEL_Y_OFFSET = 14;

export const HOVER_ZONE_X_PADDING = 6;
