import {
  calculateDomain,
  clearSVG,
  createInteractionOverlay,
  createLineGenerator,
  createMainGroup,
  createScales,
  findClosestDataPoint,
  formatNumber,
  renderAxes,
  renderGridLines,
  SVGSelection,
} from "@/components/plots/utils";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { CATEGORY_CONFIG } from "@/containers/scenario-dashboard/utils/category-config";
import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  DOT_RADIUS,
  DOT_STROKE_WIDTH,
  FONT_SIZE,
  GREY,
  GRID_STROKE_COLOR,
  STONE,
} from "@/components/plots/utils/constants";
import * as d3 from "d3";

const SINGLE_LINE_CLASS_PREFIX = "single-line-run-";
const HOVER_GROUP_CLASS = "hover-group";

const PLOT_CONFIG = {
  NORMAL_STROKE_WIDTH: 2.5,
  HOVER_HIGHLIGHT_WIDTH: 3,
  NORMAL_OPACITY: 0.7,
  DIMMED_OPACITY: 0.2,
  FULL_OPACITY: 1,
  FAST_TRANSITION_MS: 100,
  NORMAL_TRANSITION_MS: 150,
};

export const renderSingleLinePlot = (svg: SVGSelection, run: ExtendedRun): void => {
  clearSVG(svg);
  const dimensions = getPlotDimensions();
  const g = createMainGroup(svg, dimensions);
  const domain = calculateDomain(run.points);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);
  const lineGenerator = createLineGenerator(scales);

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes(g, scales, dimensions.INNER_HEIGHT);

  const sortedPoints = [...run.points].sort((a, b) => a.year - b.year);
  const categoryKey = run.flagCategory as keyof typeof CATEGORY_CONFIG;
  const color = CATEGORY_CONFIG[categoryKey]?.color;

  g.append("path")
    .datum(sortedPoints)
    .attr("class", `${SINGLE_LINE_CLASS_PREFIX}`)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH)
    .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .attr("d", lineGenerator)
    .style("cursor", "pointer")
    .style("pointer-events", "stroke");

  const hoverGroup = g.append("g").attr("class", HOVER_GROUP_CLASS);

  const horizontalHoverLine = hoverGroup
    .append("line")
    .attr("y1", 0)
    .attr("y2", dimensions.INNER_HEIGHT)
    .attr("stroke", STONE)
    .attr("stroke-width", 1)
    .style("opacity", 0);

  const intersectionHoverPoint = hoverGroup
    .append("circle")
    .attr("r", DOT_RADIUS)
    .attr("fill", color)
    .attr("stroke", "white")
    .attr("stroke-width", DOT_STROKE_WIDTH)
    .style("opacity", 0);

  const pointWrappingCircle = hoverGroup
    .append("circle")
    .attr("r", DOT_HOVER_RADIUS)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", DOT_HOVER_STROKE)
    .attr("stroke-opacity", 0.3)
    .style("opacity", 0);

  const tooltip = hoverGroup.append("g").attr("class", "svg-tooltip").style("opacity", 0);

  const tooltipRect = tooltip
    .append("rect")
    .attr("fill", "white")
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

  const tooltipText = tooltip
    .append("text")
    .attr("text-anchor", "start")
    .style("font-size", FONT_SIZE)
    .style("fill", GREY);

  const interactionOverlay = createInteractionOverlay(
    g,
    dimensions.INNER_WIDTH,
    dimensions.INNER_HEIGHT,
  );

  interactionOverlay
    .on("mouseenter", () => {
      horizontalHoverLine.style("opacity", 1);
      intersectionHoverPoint.style("opacity", 1);
      tooltip.style("opacity", 1);
      pointWrappingCircle.style("opacity", 1);
    })
    .on("mouseleave", () => {
      horizontalHoverLine.style("opacity", 0);
      intersectionHoverPoint.style("opacity", 0);
      tooltip.style("opacity", 0);
      pointWrappingCircle.style("opacity", 0);
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, sortedPoints);

      if (!nearestData) return;

      const x = scales.xScale(nearestData.year);
      const y = scales.yScale(nearestData.value);

      horizontalHoverLine.attr("x1", x).attr("x2", x);
      intersectionHoverPoint.attr("cx", x).attr("cy", y);
      pointWrappingCircle.attr("cx", x).attr("cy", y);

      const tooltipLines = [
        `Year: ${nearestData.year}`,
        `Value: ${formatNumber(nearestData.value)}`,
      ];

      tooltipText.selectAll("tspan").remove();
      tooltipLines.forEach((line, i) => {
        tooltipText
          .append("tspan")
          .attr("x", 8)
          .attr("y", 16 + i * 16)
          .text(line);
      });

      const tooltipWidth = 160;
      const tooltipHeight = 60;
      let tooltipX = x + 10;
      let tooltipY = y - 30;

      if (tooltipX + tooltipWidth > dimensions.INNER_WIDTH) {
        tooltipX = x - tooltipWidth - 10;
      }
      if (tooltipY < 0) {
        tooltipY = y + 10;
      }
      if (tooltipY + tooltipHeight > dimensions.INNER_HEIGHT) {
        tooltipY = dimensions.INNER_HEIGHT - tooltipHeight;
      }

      tooltip.attr("transform", `translate(${tooltipX}, ${tooltipY})`);
      tooltipRect.attr("width", tooltipWidth).attr("height", tooltipHeight);
    });
};
