import * as d3 from "d3";
import { AggregatedDataPoint } from "@/components/plots/types";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import {
  AREA_BACKGROUND_COLOR,
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  DOT_RADIUS,
  DOT_STROKE_WIDTH,
  GREY,
  STONE,
} from "@/components/plots/utils/constants";
import {
  SVGSelection,
  PlotDomain,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
  createInteractionOverlay,
  findClosestDataPoint,
  formatNumber,
  processAreaChartData,
} from "@/components/plots/utils";

export const renderAreaPlot = (svg: SVGSelection, runs: ExtendedRun[]): void => {
  clearSVG(svg);
  if (runs.length === 0) return;
  const dimensions = getPlotDimensions();
  const { aggregatedData, xDomain, yDomain } = processAreaChartData(runs);

  const { INNER_WIDTH, INNER_HEIGHT } = dimensions;
  const g = createMainGroup(svg, dimensions);

  const domain: PlotDomain = { xDomain, yDomain };
  const scales = createScales(domain, INNER_WIDTH, INNER_HEIGHT);

  renderGridLines(g, scales.yScale, INNER_WIDTH);
  renderAxes(
    g,
    scales,
    INNER_HEIGHT,
    aggregatedData.map((d) => d.year),
  );

  const areaSurface = d3
    .area<AggregatedDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y0((d) => scales.yScale(d.min))
    .y1((d) => scales.yScale(d.max))
    .curve(d3.curveMonotoneX);

  const averageLine = d3
    .line<AggregatedDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.average))
    .curve(d3.curveMonotoneX);

  g.append("path").datum(aggregatedData).attr("fill", AREA_BACKGROUND_COLOR).attr("d", areaSurface);

  g.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", GREY)
    .attr("stroke-width", 1.37)
    .attr("d", averageLine);

  const hoverGroup = g.append("g").attr("class", "hover-group");

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
    .attr("fill", GREY)
    .attr("stroke", "white")
    .attr("stroke-width", DOT_STROKE_WIDTH)
    .style("opacity", 0);

  const pointWrappingCircle = hoverGroup
    .append("circle")
    .attr("r", DOT_HOVER_RADIUS)
    .attr("fill", "none")
    .attr("stroke", GREY)
    .attr("stroke-width", DOT_HOVER_STROKE)
    .attr("stroke-opacity", 0.3)
    .style("opacity", 0);

  const tooltip = hoverGroup.append("g").attr("class", "svg-tooltip").style("opacity", 0);

  const tooltipRect = tooltip
    .append("rect")
    .attr("fill", "white")
    .attr("stroke", "#E7E5E4")
    .attr("stroke-width", 1)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

  const tooltipText = tooltip
    .append("text")
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .style("fill", "#44403C");

  const interactionOverlay = createInteractionOverlay(g, INNER_WIDTH, INNER_HEIGHT);

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
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, aggregatedData);

      if (!nearestData) return;

      const x = scales.xScale(nearestData.year);
      const y = scales.yScale(nearestData.average);

      horizontalHoverLine.attr("x1", x).attr("x2", x);
      intersectionHoverPoint.attr("cx", x).attr("cy", y);
      pointWrappingCircle.attr("cx", x).attr("cy", y);

      const tooltipLines = [
        `Year: ${nearestData.year}`,
        `Average: ${formatNumber(nearestData.average)}`,
        `Range: ${formatNumber(nearestData.min)} - ${formatNumber(nearestData.max)}`,
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

      if (tooltipX + tooltipWidth > INNER_WIDTH) {
        tooltipX = x - tooltipWidth - 10;
      }
      if (tooltipY < 0) {
        tooltipY = y + 10;
      }
      if (tooltipY + tooltipHeight > INNER_HEIGHT) {
        tooltipY = INNER_HEIGHT - tooltipHeight;
      }

      tooltip.attr("transform", `translate(${tooltipX}, ${tooltipY})`);
      tooltipRect.attr("width", tooltipWidth).attr("height", tooltipHeight);
    });
};
