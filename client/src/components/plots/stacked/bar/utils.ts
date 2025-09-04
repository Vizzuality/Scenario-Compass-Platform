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

export const renderStackedBarPlot = ({ svg, runs, dimensions }: Props): void => {
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
  const colors = ["#5a8bb0", "#9575a3", "#d1949e"]; // Blue-gray, Purple, Pink

  // Create stack
  const stack = d3.stack<StackedDataPoint>().keys(keys);
  const stackedData = stack(data);

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.year.toString()))
    .range([0, dimensions.INNER_WIDTH])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1]) || 0])
    .range([dimensions.INNER_HEIGHT, 0]);

  // Render grid and axes
  renderGridLines(g, yScale, dimensions.INNER_WIDTH);
  renderAxes({
    g,
    scales: {
      xScale: d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year) as [number, number])
        .range([0, dimensions.INNER_WIDTH]),
      yScale,
    },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: data.map((d) => d.year),
  });

  // Render stacked bars
  const barGroups = g
    .selectAll(".bar-group")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("fill", (d, i) => colors[i]);

  barGroups
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.data.year.toString())!)
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("stroke", "white")
    .attr("stroke-width", 1);

  // Add interaction overlay
  const interactionOverlay = createInteractionOverlay(
    g,
    dimensions.INNER_WIDTH,
    dimensions.INNER_HEIGHT,
  );

  interactionOverlay
    .on("mouseenter", () => {
      tooltipManager?.show();
    })
    .on("mouseleave", () => {
      tooltipManager?.hide();
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);

      // Find which bar we're hovering over
      const yearString = sortedYears.find((year) => {
        const barX = xScale(year.toString())!;
        const barWidth = xScale.bandwidth();
        return mouseX >= barX && mouseX <= barX + barWidth;
      });

      if (!yearString) return;

      const nearestDataPoint = data.find((d) => d.year === yearString);
      if (!nearestDataPoint) return;

      const barX = xScale(yearString.toString())!;
      const barCenterX = barX + xScale.bandwidth() / 2;

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

      tooltipManager?.update(tooltipHTML, barCenterX, dimensions.INNER_HEIGHT / 2);
    });
};
