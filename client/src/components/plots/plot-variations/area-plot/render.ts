import * as d3 from "d3";
import { AggregatedDataPoint } from "@/types/data/data-point";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { AREA_BACKGROUND_COLOR, GREY, STROKE_WIDTH } from "@/lib/config/plots/plots-constants";
import {
  SVGSelection,
  PlotDomain,
  addSciWeightedStats,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
  createInteractionOverlay,
  findClosestDataPoint,
  computeAreaChartDomains,
} from "@/utils/plots/render-functions";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { createHoverElements } from "@/utils/plots/create-hover-elements";
import { ExtendedRun } from "@/types/data/run";
import { renderHighlightedFlags } from "@/components/plots/plot-variations/area-plot/render-highlighted";
import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";
import { getRunColor } from "@/utils/plots/colors-functions";
import { formatNumber } from "@/utils/plots/format-functions";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  selectedFlags: string[];
  onRunClick?: (run: ExtendedRun) => void;
  yExtent?: YExtentPair;
  showSciWeightedMedian?: boolean;
  showSciWeightedPercentiles?: boolean;
}

export const renderAreaPlot = ({
  svg,
  runs,
  dimensions,
  selectedFlags = [],
  yExtent,
  showSciWeightedMedian = false,
  showSciWeightedPercentiles = false,
}: Props): (() => void) | void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;

  const COMPUTED_OPACITY = selectedFlags?.length > 0 ? 1 : 1;

  if (runs.length === 0) return;

  const allPoints = runs.flatMap((run) => run.orderedPoints);
  const {
    aggregatedData: baseAggregatedData,
    xDomain,
    yDomain,
  } = computeAreaChartDomains(allPoints, yExtent);
  const hasWeightedStats = showSciWeightedMedian || showSciWeightedPercentiles;
  const aggregatedData = hasWeightedStats
    ? addSciWeightedStats(baseAggregatedData, runs)
    : baseAggregatedData;
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
    yUnitText: runs[0].unit,
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

  const weightedMedianLine = d3
    .line<AggregatedDataPoint>()
    .defined((d) => d.sciWeightedMedian !== undefined)
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.sciWeightedMedian!))
    .curve(d3.curveMonotoneX);

  const weightedP05Line = d3
    .line<AggregatedDataPoint>()
    .defined((d) => d.sciWeightedP05 !== undefined)
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.sciWeightedP05!))
    .curve(d3.curveMonotoneX);

  const weightedP95Line = d3
    .line<AggregatedDataPoint>()
    .defined((d) => d.sciWeightedP95 !== undefined)
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.sciWeightedP95!))
    .curve(d3.curveMonotoneX);

  const renderBaseWeightedLines = () => {
    if (showSciWeightedMedian) {
      groupSelection
        .append("path")
        .datum(aggregatedData)
        .attr("fill", "none")
        .attr("stroke", GREY)
        .attr("opacity", COMPUTED_OPACITY)
        .attr("stroke-width", STROKE_WIDTH + 0.5)
        .attr("stroke-dasharray", "3 2")
        .attr("d", weightedMedianLine);
    }

    if (showSciWeightedPercentiles) {
      [weightedP05Line, weightedP95Line].forEach((line) => {
        groupSelection
          .append("path")
          .datum(aggregatedData)
          .attr("fill", "none")
          .attr("stroke", GREY)
          .attr("opacity", COMPUTED_OPACITY * 0.35)
          .attr("stroke-width", Math.max(0.75, STROKE_WIDTH - 0.4))
          .attr("stroke-dasharray", "8 5")
          .attr("d", line);
      });
    }
  };

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
      visibleRuns: runs,
      scales,
      selectedFlags,
      showSciWeightedMedian,
      showSciWeightedPercentiles,
    });

    const selectedRunsByFlag = new Map<string, ExtendedRun[]>();

    runs.forEach((run) => {
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
      const { aggregatedData: flagAggregatedData } = computeAreaChartDomains(flagPoints);
      aggregatedDataByFlag.set(
        flagAbbrev,
        hasWeightedStats ? addSciWeightedStats(flagAggregatedData, runs) : flagAggregatedData,
      );
    });
  }

  renderBaseWeightedLines();

  const { verticalHoverLine, intersectionPoint, pointWrappingCircle } = createHoverElements(
    groupSelection,
    INNER_HEIGHT,
  );

  const interactionOverlay = createInteractionOverlay(groupSelection, INNER_WIDTH, INNER_HEIGHT);

  const updateHoverState = (targetYear: number | null) => {
    if (targetYear === null) {
      verticalHoverLine.style("opacity", 0);
      if (!hasSelection) {
        intersectionPoint.style("opacity", 0);
        pointWrappingCircle.style("opacity", 0);
      }
      tooltipManager.hide();
      return;
    }

    const nearestData = aggregatedData.find((d) => d.year === targetYear);
    if (!nearestData) {
      updateHoverState(null);
      return;
    }

    const pointX = scales.xScale(nearestData.year);
    const pointY = scales.yScale(nearestData.median);

    if (hasSelection) {
      verticalHoverLine.style("opacity", 1).attr("x1", pointX).attr("x2", pointX);
    } else {
      verticalHoverLine.style("opacity", 1).attr("x1", pointX).attr("x2", pointX);
      intersectionPoint.style("opacity", 1).attr("cx", pointX).attr("cy", pointY);
      pointWrappingCircle.style("opacity", 1).attr("cx", pointX).attr("cy", pointY);
    }

    let tooltipHTML: string;

    if (hasSelection || hasWeightedStats) {
      const tableRows: string[] = [];

      aggregatedDataByFlag.forEach((flagData, flagName) => {
        const flagDataPoint = flagData.find((d) => d.year === targetYear);
        if (!flagDataPoint) return;

        let color = GREY;
        if (flagName !== "Base") {
          const flagRun = runs.find((run) => getCategoryAbbrev(run.flagCategory) === flagName);
          if (flagRun) {
            color = getRunColor(flagRun, selectedFlags, hasSelection);
          }
        }

        const colorDot = `<div style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; margin-inline: auto;"></div>`;

        tableRows.push(`
        <tr class="border-b border-gray-300 last:border-b-0">
          <td class="px-1.5 py-1 border-r border-gray-300">
              ${colorDot}
          </td>
          <td class="px-1.5 py-1 text-right border-r border-gray-300">${formatNumber(flagDataPoint.min)}</td>
          ${
            showSciWeightedPercentiles
              ? `<td class="px-1.5 py-1 text-right border-r border-gray-300">${flagDataPoint.sciWeightedP05 !== undefined ? formatNumber(flagDataPoint.sciWeightedP05) : "-"}</td>`
              : ""
          }
          <td class="px-1.5 py-1 text-right border-r border-gray-300">${formatNumber(flagDataPoint.median)}</td>
          ${
            showSciWeightedMedian
              ? `<td class="px-1.5 py-1 text-right border-r border-gray-300">${flagDataPoint.sciWeightedMedian !== undefined ? formatNumber(flagDataPoint.sciWeightedMedian) : "-"}</td>`
              : ""
          }
          ${
            showSciWeightedPercentiles
              ? `<td class="px-1.5 py-1 text-right border-r border-gray-300">${flagDataPoint.sciWeightedP95 !== undefined ? formatNumber(flagDataPoint.sciWeightedP95) : "-"}</td>`
              : ""
          }
          <td class="px-1.5 py-1 text-right">${formatNumber(flagDataPoint.max)}</td>
        </tr>
      `);
      });

      tooltipHTML = `
      <div class="text-black text-xs">
        <div class="mb-2 font-semibold">Year: ${nearestData.year}</div>
        <table class="w-full border-collapse border border-gray-400">
          <thead>
            <tr class="border-b border-gray-400 bg-gray-100">
              <th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">Flag</th>
              <th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">Min</th>
              ${
                showSciWeightedPercentiles
                  ? `<th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">5*</th>`
                  : ""
              }
              <th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">Med</th>
              ${
                showSciWeightedMedian
                  ? `<th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">W. Med*</th>`
                  : ""
              }
              ${
                showSciWeightedPercentiles
                  ? `<th class="px-1.5 py-1 text-center font-semibold border-r border-gray-300">95*</th>`
                  : ""
              }
              <th class="px-1.5 py-1 text-center font-semibold">Max</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
        ${hasWeightedStats ? `<div class="mt-1 text-[10px] text-gray-600">* computed using weighted ensemble data</div>` : ""}
      </div>
    `;
    } else {
      tooltipHTML = `
      <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
        <li><strong>Year:</strong> ${nearestData.year}</li>
        <li><strong>Max:</strong> <span>${formatNumber(nearestData.max)}</span></li>
        <li><strong>Median:</strong> <span>${formatNumber(nearestData.median)}</span></li>
        <li><strong>Min:</strong> <span>${formatNumber(nearestData.min)}</span></li>
      </ul>
    `;
    }

    const yPosition = hasSelection ? dimensions.INNER_HEIGHT / 2 : pointY;
    tooltipManager.show();
    tooltipManager.update(tooltipHTML, pointX, yPosition);
  };

  interactionOverlay
    .on("mouseleave", () => {
      window.dispatchEvent(new CustomEvent("sync-plot-hover", { detail: { year: null } }));
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const nearestData = findClosestDataPoint(mouseX, scales.xScale, aggregatedData);

      if (!nearestData) return;

      window.dispatchEvent(
        new CustomEvent("sync-plot-hover", { detail: { year: nearestData.year } }),
      );
    });

  const handleSync = (e: Event) => {
    const customEvent = e as CustomEvent<{ year: number | null }>;
    updateHoverState(customEvent.detail.year);
  };

  window.addEventListener("sync-plot-hover", handleSync);

  return () => {
    window.removeEventListener("sync-plot-hover", handleSync);
  };
};
