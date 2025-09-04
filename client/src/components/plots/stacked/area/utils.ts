import {
  clearSVG,
  createInteractionOverlay,
  createMainGroup,
  formatNumber,
  renderAxes,
  renderGridLines,
  SVGSelection,
} from "@/components/plots/utils";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import * as d3 from "d3";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
}

interface StackedDataPoint {
  year: number;
  [key: string]: number;
}

export const renderStackedAreaPlot = ({ svg, runs, dimensions }: Props): void => {
  clearSVG(svg);
  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  // Get all years
  const allYears = new Set<number>();
  runs.forEach((run) => {
    run.orderedPoints.forEach((point) => allYears.add(point.year));
  });
  const sortedYears = Array.from(allYears).sort((a, b) => a - b);

  // Create stacked data
  const data: StackedDataPoint[] = sortedYears.map((year) => {
    const dataPoint: StackedDataPoint = { year };
    runs.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      dataPoint[run.scenarioName] = point ? point.value : 0;
    });
    return dataPoint;
  });

  // Setup
  const keys = runs.map((run) => run.scenarioName);
  const colors = ["#5a8bb0", "#9575a3", "#d1949e"]; // Blue-gray, Purple, Pink from the image

  // Create stack
  const stack = d3.stack<StackedDataPoint>().keys(keys);
  const stackedData = stack(data);

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year) as [number, number])
    .range([0, dimensions.INNER_WIDTH]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1]) || 0])
    .range([dimensions.INNER_HEIGHT, 0]);

  // Create area
  const area = d3
    .area<d3.SeriesPoint<StackedDataPoint>>()
    .x((d) => xScale(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveCardinal);

  // Render grid and axes
  renderGridLines(g, yScale, dimensions.INNER_WIDTH);
  renderAxes({
    g,
    scales: { xScale, yScale },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: data.map((d) => d.year),
  });

  // Render areas
  g.selectAll(".stacked-area")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "stacked-area")
    .attr("d", area)
    .attr("fill", (d, i) => colors[i])
    .attr("stroke", "white")
    .attr("stroke-width", 1);

  // Add hover line
  const verticalHoverLine = g
    .append("line")
    .attr("class", "hover-line")
    .attr("y1", 0)
    .attr("y2", dimensions.INNER_HEIGHT)
    .attr("stroke", "#666")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3,3")
    .style("opacity", 0);

  // Add interaction overlay
  const interactionOverlay = createInteractionOverlay(
    g,
    dimensions.INNER_WIDTH,
    dimensions.INNER_HEIGHT,
  );

  interactionOverlay
    .on("mouseenter", () => {
      verticalHoverLine.style("opacity", 1);
      tooltipManager?.show();
    })
    .on("mouseleave", () => {
      verticalHoverLine.style("opacity", 0);
      tooltipManager?.hide();
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const year = Math.round(xScale.invert(mouseX));

      const nearestDataPoint =
        data.find((d) => d.year === year) ||
        data.reduce((prev, curr) =>
          Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev,
        );

      if (!nearestDataPoint) return;

      const pointX = xScale(nearestDataPoint.year);
      verticalHoverLine.attr("x1", pointX).attr("x2", pointX);

      const tooltipContent = keys
        .map((key) => {
          const value = nearestDataPoint[key];
          return `<li><strong>${key}:</strong> ${formatNumber(value)}</li>`;
        })
        .join("");

      const tooltipHTML = `
        <div class="text-black">
          <div class="font-bold mb-2">Year: ${nearestDataPoint.year}</div>
          <ul class="list-disc pl-4">${tooltipContent}</ul>
        </div>
      `;

      tooltipManager?.update(tooltipHTML, pointX, dimensions.INNER_HEIGHT / 2);
    });
};
