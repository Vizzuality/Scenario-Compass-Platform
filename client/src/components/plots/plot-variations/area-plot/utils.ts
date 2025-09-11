import * as d3 from "d3";
import { AggregatedDataPoint } from "@/components/plots/types";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import { AREA_BACKGROUND_COLOR, GREY } from "@/components/plots/utils/constants";
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
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { createHoverElements } from "@/components/plots/utils/create-hover-elements";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
}

export const renderAreaPlot = ({ svg, runs, dimensions }: Props): void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;
  if (runs.length === 0) return;
  const allPoints = runs.flatMap((run) => run.orderedPoints);
  const { aggregatedData, xDomain, yDomain } = processAreaChartData(allPoints);
  const { INNER_WIDTH, INNER_HEIGHT } = dimensions;
  const g = createMainGroup(svg, dimensions);
  const allYears = allPoints.map((d) => d.year);
  const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b);
  const domain: PlotDomain = { xDomain, yDomain };
  const scales = createScales(domain, INNER_WIDTH, INNER_HEIGHT);

  renderGridLines(g, scales.yScale, INNER_WIDTH);
  renderAxes({
    g,
    scales,
    height: INNER_HEIGHT,
    width: INNER_WIDTH,
    xTickValues: uniqueYears,
  });

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

  const { verticalHoverLine, intersectionPoint, pointWrappingCircle } = createHoverElements(
    g,
    INNER_HEIGHT,
  );

  const interactionOverlay = createInteractionOverlay(g, INNER_WIDTH, INNER_HEIGHT);

  interactionOverlay
    .on("mouseenter", () => {
      verticalHoverLine.style("opacity", 1);
      intersectionPoint.style("opacity", 1);
      pointWrappingCircle.style("opacity", 1);
      tooltipManager.show();
    })
    .on("mouseleave", () => {
      verticalHoverLine.style("opacity", 0);
      intersectionPoint.style("opacity", 0);
      pointWrappingCircle.style("opacity", 0);
      tooltipManager.hide();
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, aggregatedData);

      if (!nearestData) return;

      const pointX = scales.xScale(nearestData.year);
      const pointY = scales.yScale(nearestData.average);

      verticalHoverLine.attr("x1", pointX).attr("x2", pointX);
      intersectionPoint.attr("cx", pointX).attr("cy", pointY);
      pointWrappingCircle.attr("cx", pointX).attr("cy", pointY);

      const tooltipHTML = `
        <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
            <li><strong>Year:</strong> ${nearestData.year}</li>
            <li><strong>Min:</strong> <span>${formatNumber(nearestData.min)}</span></li>
            <li><strong>Average:</strong> <span>${formatNumber(nearestData.average)}</span></li>
            <li><strong>Max:</strong> <span>${formatNumber(nearestData.max)}</span></li>
        </ul>
`;

      tooltipManager.update(tooltipHTML, pointX, pointY);
    });
};
