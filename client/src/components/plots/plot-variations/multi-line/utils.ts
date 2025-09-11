import * as d3 from "d3";
import { GREY, PLOT_CONFIG } from "@/components/plots/utils/constants";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import {
  CATEGORY_CONFIG,
  getCategoryAbbrev,
} from "@/lib/config/reasons-of-concern/category-config";
import {
  SVGSelection,
  calculateDomain,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
  createLineGenerator,
  filterVisibleRuns,
  getRunColor,
  formatNumber,
  findClosestDataPoint,
} from "@/components/plots/utils";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { createHoverElements } from "@/components/plots/utils/create-hover-elements";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  selectedFlags: string[];
  hiddenFlags: string[];
  onRunClick?: (run: ExtendedRun) => void;
}

export const renderMultiLinePlot = ({
  svg,
  runs,
  dimensions,
  selectedFlags = [],
  hiddenFlags = [],
  onRunClick,
}: Props): void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;
  const visibleRuns = filterVisibleRuns(runs, hiddenFlags);
  if (visibleRuns.length === 0) return;

  const g = createMainGroup(svg, dimensions);
  const allPoints = visibleRuns.flatMap((run) => run.orderedPoints);
  const allYears = allPoints.map((d) => d.year);
  const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b);
  const hasSelection = selectedFlags.length > 0;
  const domain = calculateDomain(allPoints);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);
  const lineGenerator = createLineGenerator(scales);

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes({
    g,
    scales,
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: uniqueYears,
  });

  const linesGroup = g.append("g").attr("class", "lines-group");
  const lines = linesGroup
    .selectAll<SVGPathElement, ExtendedRun>("path")
    .data(visibleRuns, (d) => d.runId)
    .join("path")
    .attr("d", (run) => lineGenerator(run.orderedPoints))
    .attr("fill", "none")
    .attr("stroke", (run) => getRunColor(run, selectedFlags, hasSelection))
    .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH)
    .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .style("cursor", "pointer")
    .style("pointer-events", "stroke");

  lines
    .filter((run) => {
      const abbrev = getCategoryAbbrev(run.flagCategory);
      if (!abbrev) return false;
      return selectedFlags.includes(abbrev);
    })
    .raise();

  const { verticalHoverLine, intersectionPoint, pointWrappingCircle } = createHoverElements(
    g,
    dimensions.INNER_HEIGHT,
  );

  let rafId: number | null = null;

  lines
    .on("click", (event, run) => {
      event.stopPropagation();
      onRunClick?.(run);
    })
    .on("mouseenter", function (event, run) {
      verticalHoverLine.style("opacity", 1);
      intersectionPoint.style("opacity", 1);
      pointWrappingCircle.style("opacity", 1);
      tooltipManager.show();

      const hoveredLine = d3.select(this);
      const highlightColor =
        CATEGORY_CONFIG[run.flagCategory as keyof typeof CATEGORY_CONFIG]?.color || GREY;

      intersectionPoint.attr("fill", highlightColor);
      pointWrappingCircle.attr("stroke", highlightColor);

      linesGroup.selectAll("path").attr("stroke-opacity", PLOT_CONFIG.DIMMED_OPACITY);

      hoveredLine
        .attr("stroke", highlightColor)
        .attr("stroke-opacity", PLOT_CONFIG.FULL_OPACITY)
        .attr("stroke-width", PLOT_CONFIG.HOVER_HIGHLIGHT_WIDTH);

      hoveredLine.raise();
    })
    .on("mouseleave", function () {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      verticalHoverLine.style("opacity", 0);
      intersectionPoint.style("opacity", 0);
      pointWrappingCircle.style("opacity", 0);
      tooltipManager.hide();

      linesGroup
        .selectAll<SVGPathElement, ExtendedRun>("path")
        .attr("stroke", (run) => getRunColor(run, selectedFlags, hasSelection))
        .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
        .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH);
    })
    .on("mousemove", function (event, run) {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const [mouseX] = d3.pointer(event, g.node());
        const nearestData = findClosestDataPoint(mouseX, scales.xScale, run.orderedPoints);
        if (!nearestData) return;

        const pointX = scales.xScale(nearestData.year);
        const pointY = scales.yScale(nearestData.value);

        verticalHoverLine
          .attr("x1", pointX)
          .attr("x2", pointX)
          .attr("y1", 0)
          .attr("y2", dimensions.INNER_HEIGHT);

        intersectionPoint.attr("cx", pointX).attr("cy", pointY);
        pointWrappingCircle.attr("cx", pointX).attr("cy", pointY);

        const tooltipHTML = `
         <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
            <li><strong>Year:</strong> ${nearestData.year}</li>
            <li><strong>Value:</strong> <span>${formatNumber(nearestData.value)}</span></li>
            <li><strong>Model:</strong> <span>${run.modelName}</span></li>
            <li><strong>Scenario:</strong> <span>${run.scenarioName}</span></li>
        </ul>
      `;

        tooltipManager.update(tooltipHTML, pointX, pointY);
        rafId = null;
      });
    });
};
