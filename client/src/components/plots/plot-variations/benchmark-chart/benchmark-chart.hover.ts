import * as d3 from "d3";
import { GroupSelection } from "@/utils/plots/render-functions";
import {
  BENCHMARK_COLORS,
  BENCHMARK_GROUP_LABELS,
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
  MIN_RANGE_BAR_HEIGHT,
  RANGE_BAR_RADIUS,
  type BenchmarkGroupKey,
} from "./benchmark-chart.config";
import { formatPercent } from "./benchmark-chart.helpers";

export interface HoverState {
  year: number;
  groupKey: BenchmarkGroupKey;
  min: number;
  max: number;
  xBase: number;
  barWidth: number;
}

export interface HoverElements {
  maxHoverLine: d3.Selection<SVGLineElement, unknown, null, undefined>;
  minHoverLine: d3.Selection<SVGLineElement, unknown, null, undefined>;
  hoverRange: d3.Selection<SVGRectElement, unknown, null, undefined>;
  hoverHeaderLabel: d3.Selection<SVGTextElement, unknown, null, undefined>;
  maxLabel: d3.Selection<SVGTextElement, unknown, null, undefined>;
  minLabel: d3.Selection<SVGTextElement, unknown, null, undefined>;
}

export const createHoverLayer = (
  g: GroupSelection,
  innerWidth: number,
  innerHeight: number,
): HoverElements => {
  const hoverLayer = g
    .append("g")
    .attr("class", "benchmark-hover-layer")
    .style("pointer-events", "none");

  const lineAttrs = (sel: d3.Selection<SVGLineElement, unknown, null, undefined>) =>
    sel
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("stroke", HOVER_GUIDE_LINE_COLOR)
      .attr("stroke-width", HOVER_GUIDE_LINE_WIDTH)
      .attr("stroke-dasharray", HOVER_GUIDE_LINE_DASH_ARRAY)
      .style("opacity", 0);

  const maxHoverLine = lineAttrs(hoverLayer.append("line"));
  const minHoverLine = lineAttrs(hoverLayer.append("line"));

  const hoverRange = hoverLayer
    .append("rect")
    .attr("fill-opacity", HOVER_RANGE_FILL_OPACITY)
    .attr("stroke-width", HOVER_RANGE_STROKE_WIDTH)
    .attr("rx", RANGE_BAR_RADIUS)
    .style("opacity", 0);

  const labelAttrs = (sel: d3.Selection<SVGTextElement, unknown, null, undefined>) =>
    sel
      .attr("text-anchor", "end")
      .style("font-size", HOVER_LABEL_FONT_SIZE)
      .style("fill", HOVER_LABEL_TEXT_COLOR)
      .style("stroke", HOVER_LABEL_STROKE_COLOR)
      .style("stroke-width", HOVER_LABEL_STROKE_WIDTH)
      .style("paint-order", "stroke")
      .style("opacity", 0);

  const hoverHeaderLabel = labelAttrs(hoverLayer.append("text"));
  const maxLabel = labelAttrs(hoverLayer.append("text"));
  const minLabel = labelAttrs(hoverLayer.append("text"));

  return { maxHoverLine, minHoverLine, hoverRange, hoverHeaderLabel, maxLabel, minLabel };
};

export const hideHover = (elements: HoverElements): void => {
  elements.maxHoverLine.style("opacity", 0);
  elements.minHoverLine.style("opacity", 0);
  elements.hoverRange.style("opacity", 0);
  elements.hoverHeaderLabel.style("opacity", 0);
  elements.maxLabel.style("opacity", 0);
  elements.minLabel.style("opacity", 0);
};

export const updateHover = (
  elements: HoverElements,
  { year, groupKey, min, max, xBase, barWidth }: HoverState,
  yScale: d3.ScaleLinear<number, number>,
  innerWidth: number,
  innerHeight: number,
): void => {
  const colors = BENCHMARK_COLORS[groupKey];
  const maxY = yScale(max);
  const minY = yScale(min);
  const rangeY = Math.min(maxY, minY);
  const rangeHeight = Math.max(Math.abs(minY - maxY), MIN_RANGE_BAR_HEIGHT);

  elements.maxHoverLine
    .attr("y1", maxY)
    .attr("y2", maxY)
    .style("opacity", HOVER_GUIDE_LINE_OPACITY);

  elements.minHoverLine
    .attr("y1", minY)
    .attr("y2", minY)
    .style("opacity", HOVER_GUIDE_LINE_OPACITY);

  elements.hoverRange
    .attr("x", xBase)
    .attr("y", rangeY)
    .attr("width", barWidth)
    .attr("height", rangeHeight)
    .attr("fill", colors.dot)
    .attr("stroke", colors.dot)
    .style("opacity", 1);

  elements.hoverHeaderLabel
    .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
    .attr("y", HOVER_HEADER_LABEL_Y)
    .text(`${year} · ${BENCHMARK_GROUP_LABELS[groupKey]}`)
    .style("opacity", 1);

  elements.maxLabel
    .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
    .attr("y", Math.max(maxY + HOVER_MAX_LABEL_Y_OFFSET, 28))
    .text(`Max: ${formatPercent(max)}`)
    .style("opacity", 1);

  elements.minLabel
    .attr("x", innerWidth - HOVER_LABEL_RIGHT_OFFSET)
    .attr("y", Math.min(minY + HOVER_MIN_LABEL_Y_OFFSET, innerHeight - 4))
    .text(`Min: ${formatPercent(min)}`)
    .style("opacity", 1);
};
