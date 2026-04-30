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
  HOVER_LABEL_STROKE_COLOR,
  HOVER_LABEL_STROKE_WIDTH,
  HOVER_LABEL_TEXT_COLOR,
  HOVER_MAX_LABEL_Y_OFFSET,
  HOVER_MIN_LABEL_Y_OFFSET,
  HOVER_RANGE_FILL_OPACITY,
  HOVER_RANGE_STROKE_WIDTH,
  HOVER_ZONE_X_PADDING,
  MARGIN,
  MIN_RANGE_BAR_HEIGHT,
  RANGE_BAR_RADIUS,
  RANGE_BAR_STROKE_WIDTH,
  Y_AXIS_LABEL,
  Y_AXIS_LABEL_OFFSET,
  ZERO_LINE_COLOR,
  ZERO_LINE_DASH_ARRAY,
  ZERO_LINE_STROKE_WIDTH,
  type BenchmarkGroupKey,
} from "./benchmark-chart.config";
import {
  BenchmarkDataPoint,
  FigureThreeData,
  GroupBenchmarkData,
} from "@/hooks/runs/guided-exploration/figure-three/use-figure-three";
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
  } | null;
  xBase: number;
  barWidth: number;
  color: string;
  point: BenchmarkDataPoint;
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
  selectedPoint?: BenchmarkSelectedPoint | null;
  onPointClick?: (point: BenchmarkDotTooltipPoint) => void;
  onSelectedPointChange?: (point: BenchmarkDotTooltipPoint | null) => void;
}

interface HoverState {
  year: number;
  groupKey: BenchmarkGroupKey;
  min: number;
  max: number;
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
  const allValues: number[] = [0];

  activeGroups.forEach((groupKey) => {
    data[groupKey].allVetted
      .filter((point) => activeYears.includes(point.year))
      .forEach((point) => allValues.push(point.pctChange));
  });

  const yExtent = d3.extent(allValues) as [number, number];
  const yPadding = Math.max((yExtent[1] - yExtent[0]) * 0.1, 5);

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

  const activeYears = selectedYears.filter((year) => year !== BASELINE_YEAR);
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

  g.append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", ZERO_LINE_COLOR)
    .attr("stroke-width", ZERO_LINE_STROKE_WIDTH)
    .attr("stroke-dasharray", ZERO_LINE_DASH_ARRAY);

  const yAxis = g
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((tick) => `${tick}%`),
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
    .text(Y_AXIS_LABEL);

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
    .text((year) => year);

  activeGroups.forEach((groupKey) => {
    const group: GroupBenchmarkData = data[groupKey];
    const colors = BENCHMARK_COLORS[groupKey];
    const xOffset = xGroupScale(groupKey) ?? 0;
    const barWidth = xGroupScale.bandwidth();

    activeYears.forEach((year) => {
      const yearStr = String(year);
      const xBase = (xYearScale(yearStr) ?? 0) + xOffset;
      const range = getRangeByYear(group.allVetted, year);

      if (range) {
        rangeHoverStates.push({
          year,
          groupKey,
          min: range.min,
          max: range.max,
          xBase,
          barWidth,
        });
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
          range,
          xBase,
          barWidth,
          color: colors.dot,
          point,
        });
      });
    });
  });

  const hoverLayer = g
    .append("g")
    .attr("class", "benchmark-hover-layer")
    .style("pointer-events", "none");

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

  const hoverHeaderLabel = hoverLayer
    .append("text")
    .attr("class", "benchmark-hover-label benchmark-hover-header-label")
    .attr("text-anchor", "end")
    .style("font-size", HOVER_LABEL_FONT_SIZE)
    .style("fill", HOVER_LABEL_TEXT_COLOR)
    .style("stroke", HOVER_LABEL_STROKE_COLOR)
    .style("stroke-width", HOVER_LABEL_STROKE_WIDTH)
    .style("paint-order", "stroke")
    .style("opacity", 0);

  const maxLabel = hoverLayer
    .append("text")
    .attr("class", "benchmark-hover-label benchmark-hover-max-label")
    .attr("text-anchor", "end")
    .style("font-size", HOVER_LABEL_FONT_SIZE)
    .style("fill", HOVER_LABEL_TEXT_COLOR)
    .style("stroke", HOVER_LABEL_STROKE_COLOR)
    .style("stroke-width", HOVER_LABEL_STROKE_WIDTH)
    .style("paint-order", "stroke")
    .style("opacity", 0);

  const minLabel = hoverLayer
    .append("text")
    .attr("class", "benchmark-hover-label benchmark-hover-min-label")
    .attr("text-anchor", "end")
    .style("font-size", HOVER_LABEL_FONT_SIZE)
    .style("fill", HOVER_LABEL_TEXT_COLOR)
    .style("stroke", HOVER_LABEL_STROKE_COLOR)
    .style("stroke-width", HOVER_LABEL_STROKE_WIDTH)
    .style("paint-order", "stroke")
    .style("opacity", 0);

  const hideHover = (): void => {
    maxHoverLine.style("opacity", 0);
    minHoverLine.style("opacity", 0);
    hoverRange.style("opacity", 0);
    hoverHeaderLabel.style("opacity", 0);
    maxLabel.style("opacity", 0);
    minLabel.style("opacity", 0);
  };

  const updateHover = ({ year, groupKey, min, max, xBase, barWidth }: HoverState): void => {
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

    hoverHeaderLabel
      .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
      .attr("y", HOVER_HEADER_LABEL_Y)
      .text(`${year} · ${BENCHMARK_GROUP_LABELS[groupKey]}`)
      .style("opacity", 1);

    maxLabel
      .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
      .attr("y", Math.max(maxY + HOVER_MAX_LABEL_Y_OFFSET, 28))
      .text(`Max: ${formatPercent(max)}`)
      .style("opacity", 1);

    minLabel
      .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
      .attr("y", Math.min(minY + HOVER_MIN_LABEL_Y_OFFSET, innerHeight - 4))
      .text(`Min: ${formatPercent(min)}`)
      .style("opacity", 1);
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
