import * as d3 from "d3";
import { AggregatedDataPoint } from "@/components/plots/types";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import { AREA_BACKGROUND_COLOR, GREY, STROKE_WIDTH } from "@/components/plots/utils/constants";
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
  filterVisibleRuns,
  filterDecadePoints,
  getRunColor,
} from "@/components/plots/utils";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { createHoverElements } from "@/components/plots/utils/create-hover-elements";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { renderHighlightedFlags } from "@/components/plots/plot-variations/area-plot/render-highlighted";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  selectedFlags: string[];
  hiddenFlags: string[];
  showVetting: boolean;
  onRunClick?: (run: ExtendedRun) => void;
}

export const renderAreaPlot = ({
  svg,
  runs,
  dimensions,
  selectedFlags = [],
  hiddenFlags = [],
  showVetting,
}: Props): void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;
  const COMPUTED_OPACITY = selectedFlags?.length > 0 ? 0.5 : 1;
  const decadeFilteredRuns = filterDecadePoints(runs);
  const visibleRuns = filterVisibleRuns(decadeFilteredRuns, hiddenFlags, showVetting);

  if (visibleRuns.length === 0) return;

  const allPoints = visibleRuns.flatMap((run) => run.orderedPoints);
  const { aggregatedData, xDomain, yDomain } = processAreaChartData(allPoints);
  const { INNER_WIDTH, INNER_HEIGHT } = dimensions;
  const groupSelection = createMainGroup(svg, dimensions);
  const allYears = allPoints.map((d) => d.year);
  const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b);
  const domain: PlotDomain = { xDomain, yDomain };
  const scales = createScales(domain, INNER_WIDTH, INNER_HEIGHT);
  const hasSelection = selectedFlags.length > 0;

  renderGridLines(groupSelection, scales.yScale, INNER_WIDTH);
  renderAxes({
    groupSelection: groupSelection,
    scales,
    height: INNER_HEIGHT,
    width: INNER_WIDTH,
    xTickValues: uniqueYears,
    unit: visibleRuns[0].unit,
  });

  const areaSurface = d3
    .area<AggregatedDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y0((d) => scales.yScale(d.min))
    .y1((d) => scales.yScale(d.max))
    .curve(d3.curveMonotoneX);

  const medianLine = d3
    .line<AggregatedDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.median))
    .curve(d3.curveMonotoneX);

  groupSelection
    .append("path")
    .datum(aggregatedData)
    .attr("fill", AREA_BACKGROUND_COLOR)
    .attr("d", areaSurface)
    .attr("fill-opacity", COMPUTED_OPACITY);

  groupSelection
    .append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", GREY)
    .attr("opacity", COMPUTED_OPACITY)
    .attr("stroke-width", STROKE_WIDTH)
    .attr("d", medianLine);

  const aggregatedDataByFlag = new Map<string, AggregatedDataPoint[]>();
  aggregatedDataByFlag.set("Base", aggregatedData);

  if (hasSelection) {
    renderHighlightedFlags({
      groupSelection: groupSelection,
      visibleRuns,
      scales,
      selectedFlags,
    });

    const selectedRunsByFlag = new Map<string, ExtendedRun[]>();

    visibleRuns.forEach((run) => {
      const abbrev = getCategoryAbbrev(run.flagCategory);
      if (abbrev && selectedFlags.includes(abbrev)) {
        if (!selectedRunsByFlag.has(abbrev)) {
          selectedRunsByFlag.set(abbrev, []);
        }
        selectedRunsByFlag.get(abbrev)!.push(run);
      }
    });

    selectedRunsByFlag.forEach((runs, flagAbbrev) => {
      if (runs.length === 0) return;
      const flagPoints = runs.flatMap((run) => run.orderedPoints);
      const { aggregatedData: flagAggregatedData } = processAreaChartData(flagPoints);
      aggregatedDataByFlag.set(flagAbbrev, flagAggregatedData);
    });
  }

  const { verticalHoverLine, intersectionPoint, pointWrappingCircle } = createHoverElements(
    groupSelection,
    INNER_HEIGHT,
  );

  const interactionOverlay = createInteractionOverlay(groupSelection, INNER_WIDTH, INNER_HEIGHT);

  interactionOverlay
    .on("mouseenter", () => {
      if (hasSelection) {
        verticalHoverLine.style("opacity", 1);
      } else {
        verticalHoverLine.style("opacity", 1);
        intersectionPoint.style("opacity", 1);
        pointWrappingCircle.style("opacity", 1);
      }
      tooltipManager.show();
    })
    .on("mouseleave", () => {
      if (hasSelection) {
        verticalHoverLine.style("opacity", 0);
      } else {
        verticalHoverLine.style("opacity", 0);
        intersectionPoint.style("opacity", 0);
        pointWrappingCircle.style("opacity", 0);
      }
      tooltipManager.hide();
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, aggregatedData);

      if (!nearestData) return;

      const pointX = scales.xScale(nearestData.year);
      const pointY = scales.yScale(nearestData.median);

      if (hasSelection) {
        verticalHoverLine.attr("x1", pointX).attr("x2", pointX);
      } else {
        verticalHoverLine.attr("x1", pointX).attr("x2", pointX);
        intersectionPoint.attr("cx", pointX).attr("cy", pointY);
        pointWrappingCircle.attr("cx", pointX).attr("cy", pointY);
      }

      let tooltipHTML: string;

      if (hasSelection) {
        const tableRows: string[] = [];

        aggregatedDataByFlag.forEach((flagData, flagName) => {
          const flagDataPoint = findClosestDataPoint(mouseX, scales.xScale, flagData);
          if (!flagDataPoint) return;

          let color = GREY;
          if (flagName !== "Base") {
            const flagRun = visibleRuns.find(
              (run) => getCategoryAbbrev(run.flagCategory) === flagName,
            );
            if (flagRun) {
              color = getRunColor(flagRun, selectedFlags, hasSelection);
            }
          }

          const colorDot = `<div style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; margin-inline: auto;"></div>`;

          tableRows.push(`
        <tr class="border-b border-gray-300 last:border-b-0">
          <td class="px-2 py-1 border-r border-gray-300">
              ${colorDot}
          </td>
          <td class="px-2 py-1 text-right border-r border-gray-300">${formatNumber(flagDataPoint.min)}</td>
          <td class="px-2 py-1 text-right border-r border-gray-300">${formatNumber(flagDataPoint.median)}</td>
          <td class="px-2 py-1 text-right">${formatNumber(flagDataPoint.max)}</td>
        </tr>
      `);
        });

        tooltipHTML = `
      <div class="text-black text-xs">
        <div class="mb-2 font-semibold">Year: ${nearestData.year}</div>
        <table class="w-full border-collapse border border-gray-400">
          <thead>
            <tr class="border-b border-gray-400 bg-gray-100">
              <th class="px-2 py-1 text-center font-semibold border-r border-gray-300">Flag</th>
              <th class="px-2 py-1 text-center font-semibold border-r border-gray-300">Min</th>
              <th class="px-2 py-1 text-center font-semibold border-r border-gray-300">Median</th>
              <th class="px-2 py-1 text-center font-semibold">Max</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      </div>
    `;
      } else {
        tooltipHTML = `
      <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
        <li><strong>Year:</strong> ${nearestData.year}</li>
        <li><strong>Min:</strong> <span>${formatNumber(nearestData.min)}</span></li>
        <li><strong>Median:</strong> <span>${formatNumber(nearestData.median)}</span></li>
        <li><strong>Max:</strong> <span>${formatNumber(nearestData.max)}</span></li>
      </ul>
    `;
      }

      const yPosition = hasSelection ? dimensions.INNER_HEIGHT / 2 : pointY;

      tooltipManager.update(tooltipHTML, pointX, yPosition);
    });
};
