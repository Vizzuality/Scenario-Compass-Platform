import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  GRID_STROKE_COLOR,
  PLOT_CONFIG,
} from "@/lib/config/plots/plots-constants";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import * as d3 from "d3";
import {
  SVGSelection,
  createMainGroup,
  clearSVG,
  renderAxes,
} from "@/utils/plots/render-functions";
import { FigureOneDataPoint } from "@/hooks/guided-exploration/figure-one/use-figure-one";
import { createScatterTooltipHelpers } from "./scatter-tooltip";
import { IS_PART_OF_AR_6 } from "@/lib/config/reasons-of-concern/category-config";
import { createScatterScales } from "./scatter-scales";
import {
  DOT_CLASS_PREFIX,
  DOT_TOOLTIP_CLASS,
  NOT_AR_6_COLOR,
  NOT_AR_6_COLOR_DIMMED,
  AR_6_COLOR,
  AR_6_COLOR_DIMMED,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";

const isVetted = (d: FigureOneDataPoint) =>
  d.run.metaIndicators.some((mi) => mi.key === IS_PART_OF_AR_6 && mi.value === "true");

const getDotColor = (d: FigureOneDataPoint) => (isVetted(d) ? AR_6_COLOR : NOT_AR_6_COLOR);

const getDimmedColor = (d: FigureOneDataPoint) =>
  isVetted(d) ? AR_6_COLOR_DIMMED : NOT_AR_6_COLOR_DIMMED;

interface Props {
  svg: SVGSelection;
  points: FigureOneDataPoint[];
  dimensions: PlotDimensions;
  selectedPoint?: FigureOneDataPoint | null;
  onPointClick?: (point: FigureOneDataPoint) => void;
  onSelectedPointChange?: (point: FigureOneDataPoint | null) => void;
  xLabel: string;
  yLabel: string;
}

export const renderScatterPlot = ({
  svg,
  points,
  dimensions,
  selectedPoint,
  onPointClick,
  onSelectedPointChange,
  xLabel,
  yLabel,
}: Props): void => {
  clearSVG(svg);

  const containerEl = svg.node()?.parentElement as HTMLDivElement | null;
  if (!containerEl || points.length === 0) return;

  containerEl.style.position = "relative";

  const existingTooltip = containerEl.querySelector<HTMLDivElement>(`.${DOT_TOOLTIP_CLASS}`);

  if (existingTooltip) {
    existingTooltip.remove();
  }

  const tooltipEl = document.createElement("div");
  tooltipEl.className = DOT_TOOLTIP_CLASS;
  containerEl.appendChild(tooltipEl);

  let dots: d3.Selection<SVGCircleElement, FigureOneDataPoint, SVGGElement, unknown>;

  const resetDots = () => {
    dots
      .transition()
      .duration(0)
      .attr("fill", (d) => getDotColor(d))
      .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS);
  };

  const dimDots = (hoveredRunId: string) => {
    dots
      .filter((p) => String(p.runId) !== hoveredRunId)
      .transition()
      .duration(0)
      .attr("fill", (d) => getDimmedColor(d))
      .attr("fill-opacity", 1)
      .attr("stroke", "none");
  };

  const tooltip = createScatterTooltipHelpers(tooltipEl, xLabel, yLabel, onPointClick, () => {
    tooltip.setInteractive(false);
    onSelectedPointChange?.(null);
    resetDots();
  });

  const g = createMainGroup(svg, dimensions);

  const clipId = "scatter-clip-" + Math.random().toString(36).slice(2);

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", clipId)
    .append("rect")
    .attr("width", dimensions.INNER_WIDTH)
    .attr("height", dimensions.INNER_HEIGHT);

  const scales = createScatterScales(points, dimensions);
  const { xScale, yScale } = scales;

  /*
   * Grid lines
   */
  const gridGroup = g.append("g").attr("class", "grid-group");

  gridGroup
    .selectAll(".grid-line-horizontal")
    .data(yScale.ticks(6))
    .enter()
    .append("line")
    .attr("class", "grid-line-horizontal")
    .attr("x1", 0)
    .attr("x2", dimensions.INNER_WIDTH)
    .attr("y1", yScale)
    .attr("y2", yScale)
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  gridGroup
    .selectAll(".grid-line-vertical")
    .data(xScale.ticks(6))
    .enter()
    .append("line")
    .attr("class", "grid-line-vertical")
    .attr("x1", xScale)
    .attr("x2", xScale)
    .attr("y1", 0)
    .attr("y2", dimensions.INNER_HEIGHT)
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  /*
   * Axes
   */
  renderAxes({
    groupSelection: g,
    scales: { xScale, yScale },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    yUnitText: yLabel,
    xUnitText: xLabel,
  });

  /*
   * Dots
   */
  const dotsGroup = g.append("g").attr("clip-path", `url(#${clipId})`);

  const getAbsCoords = (d: FigureOneDataPoint) => ({
    absX: dimensions.MARGIN.LEFT + xScale(d.xValue),
    absY: dimensions.MARGIN.TOP + yScale(d.yValue),
  });

  dots = dotsGroup
    .selectAll<SVGCircleElement, FigureOneDataPoint>(".data-point")
    .data(points)
    .join("circle")
    .attr("class", (d) => `${DOT_CLASS_PREFIX}${d.runId}`)
    .attr("cx", (d) => xScale(d.xValue))
    .attr("cy", (d) => yScale(d.yValue))
    .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS)
    .attr("fill", (d) => getDotColor(d))
    .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .style("cursor", "pointer");

  const selectDot = (d: FigureOneDataPoint) => {
    const hoverColor = getDotColor(d);

    dimDots(String(d.runId));

    dots
      .filter((p) => p.runId === d.runId)
      .raise()
      .transition()
      .duration(0)
      .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
      .attr("fill", hoverColor)
      .attr("stroke", "white")
      .attr("stroke-width", DOT_HOVER_STROKE)
      .attr("r", DOT_HOVER_RADIUS);

    tooltip.setInteractive(true);
    tooltip.updateContent(d);

    const { absX, absY } = getAbsCoords(d);

    tooltip.position(absX, absY, containerEl.offsetWidth, containerEl.offsetHeight);
  };

  if (selectedPoint) {
    const match = points.find((p) => p.runId === selectedPoint.runId);
    if (match) {
      selectDot(match);
    }
  }

  dots
    .on("mouseenter", function (_event, d) {
      if (tooltipEl.style.pointerEvents === "auto") return;

      const hovered = d3.select(this);
      const hoverColor = getDotColor(d);

      dimDots(String(d.runId));

      hovered
        .raise()
        .transition()
        .duration(0)
        .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
        .attr("fill", hoverColor)
        .attr("stroke", "white")
        .attr("stroke-width", DOT_HOVER_STROKE)
        .attr("r", DOT_HOVER_RADIUS);

      tooltip.updateContent(d);

      const { absX, absY } = getAbsCoords(d);

      tooltip.position(absX, absY, containerEl.offsetWidth, containerEl.offsetHeight);
    })
    .on("mouseleave", function () {
      if (tooltipEl.style.pointerEvents === "auto") return;

      tooltip.hide();
      resetDots();
    })
    .on("click", function (event, d) {
      event.stopPropagation();

      onSelectedPointChange?.(d);
      selectDot(d);
    });

  svg.on("click.tooltip-reset", () => {
    tooltip.setInteractive(false);
    tooltip.hide();
    onSelectedPointChange?.(null);
    resetDots();
  });
};
