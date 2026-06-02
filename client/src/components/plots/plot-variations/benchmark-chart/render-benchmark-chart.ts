import * as d3 from "d3";

import { SVGSelection, createMainGroup, clearSVG } from "@/utils/plots/render-functions";
import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  FONT_SIZE,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  PLOT_CONFIG,
} from "@/lib/config/plots/plots-constants";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { formatNumber } from "@/utils/plots/format-functions";
import { DOT_TOOLTIP_CLASS } from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";
import {
  BASELINE_YEAR,
  BENCHMARK_COLORS,
  BENCHMARK_GROUP_KEYS,
  BENCHMARK_GROUP_LABELS,
  DOT_FILL_OPACITY,
  DOT_RADIUS,
  DOT_STROKE_WIDTH,
  HOVER_GUIDE_LINE_COLOR,
  HOVER_GUIDE_LINE_DASH_ARRAY,
  HOVER_GUIDE_LINE_OPACITY,
  HOVER_GUIDE_LINE_WIDTH,
  HOVER_HEADER_LABEL_Y,
  HOVER_LABEL_FONT_SIZE,
  HOVER_LABEL_RIGHT_OFFSET,
  HOVER_LABEL_TEXT_COLOR,
  HOVER_RANGE_FILL_OPACITY,
  HOVER_RANGE_STROKE_WIDTH,
  HOVER_ZONE_X_PADDING,
  MARGIN,
  MIN_RANGE_BAR_HEIGHT,
  RANGE_BAR_RADIUS,
  RANGE_BAR_STROKE_WIDTH,
  UNVETTED_WHISKER_CAP_WIDTH_RATIO,
  UNVETTED_WHISKER_DASH_ARRAY,
  UNVETTED_WHISKER_STROKE_WIDTH,
  Y_AXIS_LABEL,
  Y_AXIS_LABEL_OFFSET,
  ZERO_LINE_COLOR,
  ZERO_LINE_DASH_ARRAY,
  ZERO_LINE_STROKE_WIDTH,
  type BenchmarkGroupKey,
  HOVER_PILL_PADDING_X,
  HOVER_PILL_PADDING_Y,
  HOVER_PILL_BACKGROUND_COLOR,
  HOVER_PILL_BACKGROUND_OPACITY,
  HOVER_PILL_RADIUS,
  HOVER_PILL_LINE_GAP,
  HOVER_PILL_CHART_PADDING,
} from "./benchmark-chart.config";
import {
  BenchmarkDataPoint,
  FigureThreeData,
  GroupBenchmarkData,
} from "@/hooks/guided-exploration/figure-three/use-figure-three";
import { createBenchmarkDotTooltipHelpers } from "@/components/plots/plot-variations/benchmark-chart/benchmark-chart.tooltip";

export interface BenchmarkSelectedPoint {
  year: number;
  groupKey: BenchmarkGroupKey;
  runId: string;
}

export interface BenchmarkDotTooltipPoint extends BenchmarkSelectedPoint {
  pctChange: number;
  cx: number;
  cy: number;
  range: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  } | null;
  xBase: number;
  barWidth: number;
  color: string;
  point: BenchmarkDataPoint;
  xLabel: string;
  valueLabel: string;
  valueUnit: string;
}

export interface RenderBenchmarkProps {
  svg: SVGSelection;
  data: FigureThreeData;
  width: number;
  height: number;
  selectedYears: number[];
  showGroupA: boolean;
  showGroupB: boolean;
  showRangeBars: boolean;
  showNoConcernDots: boolean;
  includeUnvetted: boolean;
  selectedPoint?: BenchmarkSelectedPoint | null;
  onPointClick?: (point: BenchmarkDotTooltipPoint) => void;
  onSelectedPointChange?: (point: BenchmarkDotTooltipPoint | null) => void;
}

interface HoverState {
  year: number;
  groupKey: BenchmarkGroupKey;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  xBase: number;
  barWidth: number;
}

interface DotLanePositionArgs {
  xBase: number;
  barWidth: number;
  point: BenchmarkDataPoint;
  groupKey: BenchmarkGroupKey;
  year: number;
  laneCount: number;
}

const YEAR_HEADER_Y = -16;
const YEAR_HEADER_FONT_SIZE = "16px";
const YEAR_HEADER_FONT_WEIGHT = 700;

const DOT_LANE_COUNT = 7;
const DOT_LANE_HORIZONTAL_PADDING = 2;

const getRangeByYear = (
  points: BenchmarkDataPoint[],
  year: number,
): { min: number; max: number } | null => {
  const values = points.filter((point) => point.year === year).map((point) => point.pctChange);

  if (!values.length) return null;

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

const getUnvettedRangeExtensions = (
  vettedRange: { min: number; max: number } | null,
  unvettedRange: { min: number; max: number } | null,
): Array<{ from: number; to: number; caps: number[] }> => {
  if (!unvettedRange) return [];

  if (!vettedRange) {
    return [
      {
        from: unvettedRange.min,
        to: unvettedRange.max,
        caps: [unvettedRange.min, unvettedRange.max],
      },
    ];
  }

  const extensions: Array<{ from: number; to: number; caps: number[] }> = [];

  if (unvettedRange.min < vettedRange.min) {
    extensions.push({ from: vettedRange.min, to: unvettedRange.min, caps: [unvettedRange.min] });
  }

  if (unvettedRange.max > vettedRange.max) {
    extensions.push({ from: vettedRange.max, to: unvettedRange.max, caps: [unvettedRange.max] });
  }

  return extensions;
};

const getHoverRangeState = ({
  year,
  groupKey,
  vettedRange,
  unvettedRange,
  includeUnvetted,
  xBase,
  barWidth,
}: {
  year: number;
  groupKey: BenchmarkGroupKey;
  vettedRange: { min: number; max: number } | null;
  unvettedRange: { min: number; max: number } | null;
  includeUnvetted: boolean;
  xBase: number;
  barWidth: number;
}): HoverState | null => {
  const displayedRange = includeUnvetted ? (unvettedRange ?? vettedRange) : vettedRange;
  if (!displayedRange) return null;

  const extendsMin = Boolean(
    includeUnvetted && vettedRange && unvettedRange && unvettedRange.min < vettedRange.min,
  );
  const extendsMax = Boolean(
    includeUnvetted && vettedRange && unvettedRange && unvettedRange.max > vettedRange.max,
  );
  const unvettedOnly = includeUnvetted && !vettedRange && Boolean(unvettedRange);

  return {
    year,
    groupKey,
    min: displayedRange.min,
    max: displayedRange.max,
    minLabel: extendsMin || unvettedOnly ? "Unvetted min" : "Min",
    maxLabel: extendsMax || unvettedOnly ? "Unvetted max" : "Max",
    xBase,
    barWidth,
  };
};

const getActiveGroups = (showGroupA: boolean, showGroupB: boolean): BenchmarkGroupKey[] => {
  return BENCHMARK_GROUP_KEYS.filter((groupKey) =>
    groupKey === "groupA" ? showGroupA : showGroupB,
  );
};

const buildYDomain = (
  data: FigureThreeData,
  activeYears: number[],
  activeGroups: BenchmarkGroupKey[],
): [number, number] => {
  const includeZero = (data.valueUnit ?? "%") === "%";
  const allValues: number[] = includeZero ? [0] : [];

  activeGroups.forEach((groupKey) => {
    data[groupKey].withUnvetted
      .filter((point) => activeYears.includes(point.year))
      .forEach((point) => allValues.push(point.pctChange));
  });

  if (!allValues.length) return [0, 1];

  const yExtent = d3.extent(allValues) as [number, number];
  const yRange = yExtent[1] - yExtent[0];
  const yPadding = Math.max(yRange * 0.1, includeZero ? 5 : 1);

  return [yExtent[0] - yPadding, yExtent[1] + yPadding];
};

const createStableHash = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const getDotLaneXPosition = ({
  xBase,
  barWidth,
  point,
  groupKey,
  year,
  laneCount,
}: DotLanePositionArgs): number => {
  const centerX = xBase + barWidth / 2;

  if (laneCount <= 1) return centerX;

  const leftX = xBase + DOT_RADIUS + DOT_LANE_HORIZONTAL_PADDING;
  const rightX = xBase + barWidth - DOT_RADIUS - DOT_LANE_HORIZONTAL_PADDING;

  if (rightX <= leftX) return centerX;

  const laneIndex = createStableHash(`${year}-${groupKey}-${point.runId}`) % laneCount;
  const step = (rightX - leftX) / (laneCount - 1);

  return leftX + step * laneIndex;
};

const sortDotsForStableLayout = (
  firstPoint: BenchmarkDataPoint,
  secondPoint: BenchmarkDataPoint,
): number => {
  if (firstPoint.pctChange !== secondPoint.pctChange) {
    return firstPoint.pctChange - secondPoint.pctChange;
  }

  return firstPoint.runId.localeCompare(secondPoint.runId);
};

const formatPercent = (value: number): string => `${formatNumber(value)}%`;

const formatBenchmarkValue = (value: number, unit = "%"): string => {
  if (unit.toLowerCase() === "year") return Math.round(value).toString();

  const formatted = formatNumber(value);
  if (!unit) return formatted;
  if (unit === "%") return `${formatted}%`;
  return `${formatted} ${unit}`;
};

const formatAxisTick = (value: number, unit = "%"): string => {
  if (unit === "%") return `${value}%`;
  if (unit.toLowerCase() === "year") return Math.round(value).toString();
  return formatNumber(value);
};

const getDotKey = (point: BenchmarkSelectedPoint): string =>
  `${point.runId}-${point.year}-${point.groupKey}`;

const findHoveredRange = (mouseX: number, ranges: HoverState[]): HoverState | null => {
  return (
    ranges.find(
      (range) =>
        mouseX >= range.xBase - HOVER_ZONE_X_PADDING &&
        mouseX <= range.xBase + range.barWidth + HOVER_ZONE_X_PADDING,
    ) ?? null
  );
};

export const renderBenchmarkChart = ({
  svg,
  data,
  width,
  height,
  selectedYears,
  showGroupA,
  showGroupB,
  showRangeBars,
  showNoConcernDots,
  includeUnvetted,
  selectedPoint,
  onPointClick,
  onSelectedPointChange,
}: RenderBenchmarkProps): void => {
  clearSVG(svg);

  const containerEl = svg.node()?.parentElement as HTMLDivElement | null;
  if (!containerEl) return;

  containerEl.style.position = "relative";

  const existingTooltip = containerEl.querySelector<HTMLDivElement>(`.${DOT_TOOLTIP_CLASS}`);
  existingTooltip?.remove();

  const tooltipEl = document.createElement("div");
  tooltipEl.className = DOT_TOOLTIP_CLASS;
  containerEl.appendChild(tooltipEl);

  const innerWidth = width - MARGIN.LEFT - MARGIN.RIGHT;
  const innerHeight = height - MARGIN.TOP - MARGIN.BOTTOM;

  if (innerWidth <= 0 || innerHeight <= 0) return;

  const dimensions: PlotDimensions = {
    WIDTH: width,
    HEIGHT: height,
    INNER_WIDTH: innerWidth,
    INNER_HEIGHT: innerHeight,
    MARGIN,
  };

  const g = createMainGroup(svg, dimensions);

  const activeYears = data.xValues ?? selectedYears.filter((year) => year !== BASELINE_YEAR);
  if (!activeYears.length) return;

  const activeGroups = getActiveGroups(showGroupA, showGroupB);
  if (!activeGroups.length) return;

  const dotTooltipPoints: BenchmarkDotTooltipPoint[] = [];
  const rangeHoverStates: HoverState[] = [];

  const yDomain = buildYDomain(data, activeYears, activeGroups);
  const yScale = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]).nice();

  const xYearScale = d3
    .scaleBand()
    .domain(activeYears.map(String))
    .range([0, innerWidth])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const xGroupScale = d3
    .scaleBand<BenchmarkGroupKey>()
    .domain(activeGroups)
    .range([0, xYearScale.bandwidth()])
    .paddingInner(0.15);

  g.selectAll(".grid-line")
    .data(yScale.ticks(6))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", (tick) => yScale(tick))
    .attr("y2", (tick) => yScale(tick))
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  if ((data.valueUnit ?? "%") === "%") {
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", ZERO_LINE_COLOR)
      .attr("stroke-width", ZERO_LINE_STROKE_WIDTH)
      .attr("stroke-dasharray", ZERO_LINE_DASH_ARRAY);
  }

  const yAxis = g
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((tick) => formatAxisTick(Number(tick), data.valueUnit ?? "%")),
    );

  yAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
  yAxis.selectAll("text").style("font-size", FONT_SIZE).style("fill", GRID_TEXT_COLOR);

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", Y_AXIS_LABEL_OFFSET)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .text(data.yAxisLabel ?? Y_AXIS_LABEL);

  g.selectAll(".benchmark-year-header")
    .data(activeYears)
    .enter()
    .append("text")
    .attr("class", "benchmark-year-header")
    .attr("x", (year) => {
      const x = xYearScale(String(year)) ?? 0;
      return x + xYearScale.bandwidth() / 2;
    })
    .attr("y", YEAR_HEADER_Y)
    .attr("text-anchor", "middle")
    .style("font-size", YEAR_HEADER_FONT_SIZE)
    .style("font-weight", YEAR_HEADER_FONT_WEIGHT)
    .style("fill", GRID_TEXT_COLOR)
    .text((year) => data.xLabels?.[year] ?? year);

  activeGroups.forEach((groupKey) => {
    const group: GroupBenchmarkData = data[groupKey];
    const colors = BENCHMARK_COLORS[groupKey];
    const xOffset = xGroupScale(groupKey) ?? 0;
    const barWidth = xGroupScale.bandwidth();

    activeYears.forEach((year) => {
      const yearStr = String(year);
      const xBase = (xYearScale(yearStr) ?? 0) + xOffset;
      const range = getRangeByYear(group.allVetted, year);
      const unvettedRange = getRangeByYear(group.withUnvetted, year);
      const hoverRangeState = getHoverRangeState({
        year,
        groupKey,
        vettedRange: range,
        unvettedRange,
        includeUnvetted,
        xBase,
        barWidth,
      });

      if (hoverRangeState) {
        rangeHoverStates.push(hoverRangeState);
      }

      if (showRangeBars && range) {
        const y1 = yScale(range.max);
        const y2 = yScale(range.min);

        g.append("rect")
          .attr("class", "benchmark-range-bar")
          .attr("x", xBase)
          .attr("y", y1)
          .attr("width", barWidth)
          .attr("height", Math.max(y2 - y1, MIN_RANGE_BAR_HEIGHT))
          .attr("fill", colors.range)
          .attr("stroke", colors.rangeBorder)
          .attr("stroke-width", RANGE_BAR_STROKE_WIDTH)
          .attr("rx", RANGE_BAR_RADIUS);
      }

      if (showRangeBars && includeUnvetted) {
        const whiskerX = xBase + barWidth / 2;
        const capHalfWidth = (barWidth * UNVETTED_WHISKER_CAP_WIDTH_RATIO) / 2;

        getUnvettedRangeExtensions(range, unvettedRange).forEach((extension) => {
          g.append("line")
            .attr("class", "benchmark-unvetted-whisker")
            .attr("x1", whiskerX)
            .attr("x2", whiskerX)
            .attr("y1", yScale(extension.from))
            .attr("y2", yScale(extension.to))
            .attr("stroke", colors.rangeBorder)
            .attr("stroke-width", UNVETTED_WHISKER_STROKE_WIDTH)
            .attr("stroke-dasharray", UNVETTED_WHISKER_DASH_ARRAY)
            .attr("stroke-linecap", "round");

          extension.caps.forEach((cap) => {
            g.append("line")
              .attr("class", "benchmark-unvetted-whisker-cap")
              .attr("x1", whiskerX - capHalfWidth)
              .attr("x2", whiskerX + capHalfWidth)
              .attr("y1", yScale(cap))
              .attr("y2", yScale(cap))
              .attr("stroke", colors.rangeBorder)
              .attr("stroke-width", UNVETTED_WHISKER_STROKE_WIDTH)
              .attr("stroke-linecap", "round");
          });
        });
      }

      if (!showNoConcernDots) return;

      const dotsForYear = [...group.noConcern]
        .filter((point) => point.year === year)
        .sort(sortDotsForStableLayout);

      const laneCount = Math.min(DOT_LANE_COUNT, Math.max(dotsForYear.length, 1));

      dotsForYear.forEach((point) => {
        const dotX = getDotLaneXPosition({
          xBase,
          barWidth,
          point,
          groupKey,
          year,
          laneCount,
        });

        const dotY = yScale(point.pctChange);

        dotTooltipPoints.push({
          year,
          groupKey,
          runId: point.runId,
          pctChange: point.pctChange,
          cx: dotX,
          cy: dotY,
          range: hoverRangeState
            ? {
                min: hoverRangeState.min,
                max: hoverRangeState.max,
                minLabel: hoverRangeState.minLabel,
                maxLabel: hoverRangeState.maxLabel,
              }
            : null,
          xBase,
          barWidth,
          color: colors.dot,
          point,
          xLabel: data.xLabels?.[year] ?? String(year),
          valueLabel: data.valueLabel ?? "Change",
          valueUnit: data.valueUnit ?? "%",
        });
      });
    });
  });

  const hoverLayer = g
    .append("g")
    .attr("class", "benchmark-hover-layer")
    .style("pointer-events", "none");

  type HoverPillPlacement = "center" | "above-line" | "below-line";

  const createHoverPillLabel = (className: string) => {
    const group = hoverLayer
      .append("g")
      .attr("class", `benchmark-hover-pill-label ${className}`)
      .style("opacity", 0);

    const background = group
      .append("rect")
      .attr("fill", HOVER_PILL_BACKGROUND_COLOR)
      .attr("fill-opacity", HOVER_PILL_BACKGROUND_OPACITY)
      .attr("rx", HOVER_PILL_RADIUS)
      .attr("ry", HOVER_PILL_RADIUS);

    const text = group
      .append("text")
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", HOVER_LABEL_FONT_SIZE)
      .style("font-weight", 600)
      .style("fill", HOVER_LABEL_TEXT_COLOR);

    const show = (
      label: string,
      x: number,
      y: number,
      placement: HoverPillPlacement = "center",
    ): void => {
      text.attr("x", x).attr("y", y).text(label);

      const textNode = text.node();
      if (!textNode) return;

      const initialBox = textNode.getBBox();

      const pillHeight = initialBox.height + HOVER_PILL_PADDING_Y * 2;
      const initialPillY = initialBox.y - HOVER_PILL_PADDING_Y;

      let targetPillY = initialPillY;

      if (placement === "above-line") {
        targetPillY = Math.max(y - HOVER_PILL_LINE_GAP - pillHeight, HOVER_PILL_CHART_PADDING);
      }

      if (placement === "below-line") {
        targetPillY = Math.min(
          y + HOVER_PILL_LINE_GAP,
          innerHeight - pillHeight - HOVER_PILL_CHART_PADDING,
        );
      }

      const textYOffset = targetPillY - initialPillY;

      text.attr("y", y + textYOffset);

      const finalBox = textNode.getBBox();

      background
        .attr("x", finalBox.x - HOVER_PILL_PADDING_X)
        .attr("y", finalBox.y - HOVER_PILL_PADDING_Y)
        .attr("width", finalBox.width + HOVER_PILL_PADDING_X * 2)
        .attr("height", finalBox.height + HOVER_PILL_PADDING_Y * 2);

      group.style("opacity", 1);
    };

    const hide = (): void => {
      group.style("opacity", 0);
    };

    return { show, hide };
  };

  const hoverHeaderLabel = createHoverPillLabel("benchmark-hover-header-label");
  const maxLabel = createHoverPillLabel("benchmark-hover-max-label");
  const minLabel = createHoverPillLabel("benchmark-hover-min-label");

  const maxHoverLine = hoverLayer
    .append("line")
    .attr("class", "benchmark-hover-line benchmark-hover-max-line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("stroke", HOVER_GUIDE_LINE_COLOR)
    .attr("stroke-width", HOVER_GUIDE_LINE_WIDTH)
    .attr("stroke-dasharray", HOVER_GUIDE_LINE_DASH_ARRAY)
    .style("opacity", 0);

  const minHoverLine = hoverLayer
    .append("line")
    .attr("class", "benchmark-hover-line benchmark-hover-min-line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("stroke", HOVER_GUIDE_LINE_COLOR)
    .attr("stroke-width", HOVER_GUIDE_LINE_WIDTH)
    .attr("stroke-dasharray", HOVER_GUIDE_LINE_DASH_ARRAY)
    .style("opacity", 0);

  const hoverRange = hoverLayer
    .append("rect")
    .attr("class", "benchmark-hover-range")
    .attr("fill-opacity", HOVER_RANGE_FILL_OPACITY)
    .attr("stroke-width", HOVER_RANGE_STROKE_WIDTH)
    .attr("rx", RANGE_BAR_RADIUS)
    .style("opacity", 0);

  const hideHover = (): void => {
    maxHoverLine.style("opacity", 0);
    minHoverLine.style("opacity", 0);
    hoverRange.style("opacity", 0);

    hoverHeaderLabel.hide();
    maxLabel.hide();
    minLabel.hide();
  };

  const updateHover = ({
    year,
    groupKey,
    min,
    max,
    minLabel: hoverMinLabel,
    maxLabel: hoverMaxLabel,
    xBase,
    barWidth,
  }: HoverState): void => {
    const colors = BENCHMARK_COLORS[groupKey];
    const maxY = yScale(max);
    const minY = yScale(min);
    const rangeY = Math.min(maxY, minY);
    const rangeHeight = Math.max(Math.abs(minY - maxY), MIN_RANGE_BAR_HEIGHT);

    maxHoverLine.attr("y1", maxY).attr("y2", maxY).style("opacity", HOVER_GUIDE_LINE_OPACITY);

    minHoverLine.attr("y1", minY).attr("y2", minY).style("opacity", HOVER_GUIDE_LINE_OPACITY);

    hoverRange
      .attr("x", xBase)
      .attr("y", rangeY)
      .attr("width", barWidth)
      .attr("height", rangeHeight)
      .attr("fill", colors.dot)
      .attr("stroke", colors.dot)
      .style("opacity", 1);

    hoverHeaderLabel.show(
      `${data.xLabels?.[year] ?? year} · ${BENCHMARK_GROUP_LABELS[groupKey]}`,
      innerWidth - HOVER_LABEL_RIGHT_OFFSET,
      HOVER_HEADER_LABEL_Y,
    );

    maxLabel.show(
      `${hoverMaxLabel}: ${formatBenchmarkValue(max, data.valueUnit ?? "%")}`,
      innerWidth - HOVER_LABEL_RIGHT_OFFSET,
      maxY,
      "above-line",
    );

    minLabel.show(
      `${hoverMinLabel}: ${formatBenchmarkValue(min, data.valueUnit ?? "%")}`,
      innerWidth - HOVER_LABEL_RIGHT_OFFSET,
      minY,
      "below-line",
    );
  };

  const interactionOverlay = g
    .append("rect")
    .attr("class", "benchmark-interaction-overlay")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("fill", "transparent")
    .style("cursor", "crosshair")
    .style("pointer-events", "all");

  let dots: d3.Selection<SVGCircleElement, BenchmarkDotTooltipPoint, SVGGElement, unknown>;

  const resetDots = () => {
    dots
      .transition()
      .duration(0)
      .attr("fill", (point) => point.color)
      .attr("fill-opacity", DOT_FILL_OPACITY)
      .attr("stroke", "white")
      .attr("stroke-width", DOT_STROKE_WIDTH)
      .attr("r", DOT_RADIUS);
  };

  const dimDots = (activeDotKey: string) => {
    dots
      .filter((point) => getDotKey(point) !== activeDotKey)
      .transition()
      .duration(0)
      .attr("fill-opacity", 0.25)
      .attr("stroke", "none");
  };

  const clearSelectedDot = () => {
    tooltip.setInteractive(false);
    tooltip.hide();
    onSelectedPointChange?.(null);
    resetDots();
    hideHover();
  };

  const tooltip = createBenchmarkDotTooltipHelpers(tooltipEl, onPointClick, clearSelectedDot);

  const selectDot = (point: BenchmarkDotTooltipPoint, interactive: boolean) => {
    const activeDotKey = getDotKey(point);

    dimDots(activeDotKey);

    dots
      .filter((candidate) => getDotKey(candidate) === activeDotKey)
      .raise()
      .transition()
      .duration(0)
      .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
      .attr("fill", point.color)
      .attr("stroke", "white")
      .attr("stroke-width", DOT_HOVER_STROKE)
      .attr("r", DOT_HOVER_RADIUS);

    tooltip.setInteractive(interactive);
    tooltip.updateContent(point);

    const absX = MARGIN.LEFT + point.cx;
    const absY = MARGIN.TOP + point.cy;

    tooltip.position(absX, absY, containerEl.offsetWidth, containerEl.offsetHeight);

    if (point.range) {
      updateHover({
        year: point.year,
        groupKey: point.groupKey,
        min: point.range.min,
        max: point.range.max,
        minLabel: point.range.minLabel,
        maxLabel: point.range.maxLabel,
        xBase: point.xBase,
        barWidth: point.barWidth,
      });
    }
  };

  interactionOverlay
    .on("mousemove", function (event) {
      if (tooltipEl.style.pointerEvents === "auto") return;

      const [mouseX] = d3.pointer(event, this);
      const hoveredRange = showRangeBars ? findHoveredRange(mouseX, rangeHoverStates) : null;

      if (hoveredRange) {
        updateHover(hoveredRange);
        return;
      }

      hideHover();
    })
    .on("mouseleave", () => {
      if (tooltipEl.style.pointerEvents === "auto") return;

      tooltip.hide();
      hideHover();
      resetDots();
    });

  dots = g
    .append("g")
    .attr("class", "benchmark-no-concern-dots")
    .selectAll<SVGCircleElement, BenchmarkDotTooltipPoint>(".benchmark-no-concern-dot")
    .data(dotTooltipPoints, (point) => getDotKey(point as BenchmarkDotTooltipPoint))
    .join("circle")
    .attr("class", "benchmark-no-concern-dot")
    .attr("cx", (point) => point.cx)
    .attr("cy", (point) => point.cy)
    .attr("r", DOT_RADIUS)
    .attr("fill", (point) => point.color)
    .attr("fill-opacity", DOT_FILL_OPACITY)
    .attr("stroke", "white")
    .attr("stroke-width", DOT_STROKE_WIDTH)
    .style("cursor", "pointer");

  const selectedMatch = selectedPoint
    ? dotTooltipPoints.find((point) => getDotKey(point) === getDotKey(selectedPoint))
    : null;

  if (selectedMatch) {
    selectDot(selectedMatch, true);
  }

  dots
    .on("mouseenter", function (_event, point) {
      if (tooltipEl.style.pointerEvents === "auto") return;
      selectDot(point, false);
    })
    .on("mouseleave", function () {
      if (tooltipEl.style.pointerEvents === "auto") return;

      tooltip.hide();
      resetDots();
      hideHover();
    })
    .on("click", function (event, point) {
      event.stopPropagation();

      onSelectedPointChange?.(point);
      selectDot(point, true);
    });

  svg.on("click.tooltip-reset", () => {
    clearSelectedDot();
  });
};
