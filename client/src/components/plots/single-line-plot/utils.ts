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
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import { CATEGORY_CONFIG } from "@/containers/scenario-dashboard/utils/category-config";
import * as d3 from "d3";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { createHoverElements } from "@/components/plots/utils/create-hover-elements";
import { PLOT_CONFIG } from "@/components/plots/utils/constants";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface Props {
  svg: SVGSelection;
  run: ExtendedRun;
  dimensions: PlotDimensions;
}

export const renderSingleLinePlot = ({ svg, run, dimensions }: Props): void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;
  const g = createMainGroup(svg, dimensions);
  const domain = calculateDomain(run.points);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);
  const lineGenerator = createLineGenerator(scales);

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes({
    g,
    scales,
    height: dimensions.INNER_HEIGHT,
    xTickValues: run.points.map((point) => point.year),
  });

  const categoryKey = run.flagCategory as keyof typeof CATEGORY_CONFIG;
  const color = CATEGORY_CONFIG[categoryKey]?.color;

  g.append("path")
    .datum(run.points)
    .attr("class", "single-line-run-")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH)
    .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .attr("d", lineGenerator)
    .style("cursor", "pointer")
    .style("pointer-events", "stroke");

  const { verticalHoverLine, intersectionPoint, pointWrappingCircle } = createHoverElements(
    g,
    dimensions.INNER_HEIGHT,
    color,
  );

  const interactionOverlay = createInteractionOverlay(
    g,
    dimensions.INNER_WIDTH,
    dimensions.INNER_HEIGHT,
  );

  interactionOverlay
    .on("mouseenter", () => {
      verticalHoverLine.style("opacity", 1);
      intersectionPoint.style("opacity", 1);
      tooltipManager.show();
      pointWrappingCircle.style("opacity", 1);
    })
    .on("mouseleave", () => {
      verticalHoverLine.style("opacity", 0);
      intersectionPoint.style("opacity", 0);
      tooltipManager.hide();
      pointWrappingCircle.style("opacity", 0);
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, run.points);

      if (!nearestData) return;

      const pointX = scales.xScale(nearestData.year);
      const pointY = scales.yScale(nearestData.value);

      verticalHoverLine.attr("x1", pointX).attr("x2", pointX);
      intersectionPoint.attr("cx", pointX).attr("cy", pointY);
      pointWrappingCircle.attr("cx", pointX).attr("cy", pointY);

      const tooltipHTML = `
      <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
          <li>
              <strong> Year: </strong> ${nearestData.year}
          </li>
          <li>
              <strong>Value: </strong>
              <span>${formatNumber(nearestData.value)}</span>
          </li>
      </ul>
`;

      tooltipManager.update(tooltipHTML, pointX, pointY);
    });
};
