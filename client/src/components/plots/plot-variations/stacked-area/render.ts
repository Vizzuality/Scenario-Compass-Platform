import * as d3 from "d3";
import {
  clearSVG,
  createInteractionOverlay,
  createMainGroup,
  renderAxes,
  renderGridLines,
  SVGSelection,
} from "@/utils/plots/render-functions";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { ExtendedRun } from "@/types/data/run";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { createHoverElements } from "@/utils/plots/create-hover-elements";
import {
  createVariableColorMap,
  getActiveVariables,
  getColorsForVariables,
} from "@/utils/plots/colors-functions";
import { formatNumber } from "@/utils/plots/format-functions";

interface StackedDataPoint {
  year: number;
  [key: string]: number;
}

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  variablesMap: Record<string, string>;
}

export const renderStackedAreaPlot = ({
  svg,
  runs,
  dimensions,
  variablesMap,
}: Props): (() => void) | void => {
  clearSVG(svg);

  if (runs.length === 0) return;

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;

  const activeVariables = getActiveVariables(runs);
  const variableNames = Object.keys(variablesMap);
  const presentVariables = variableNames.filter((variable) => activeVariables.has(variable));
  const colors = getColorsForVariables(runs[0].flagCategory, presentVariables.length);
  const variableColorMap = createVariableColorMap(presentVariables, colors);

  const allYears = [...new Set(runs.flatMap((run) => run.orderedPoints.map((p) => p.year)))].sort(
    (a, b) => a - b,
  );

  const dataPoints: StackedDataPoint[] = allYears.map((year) => {
    const dataPoint: StackedDataPoint = { year };
    runs.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      dataPoint[run.variableName] = point?.value || 0;
    });
    return dataPoint;
  });

  const stackedDataPoints = d3.stack<StackedDataPoint>().keys(presentVariables.reverse())(
    dataPoints,
  );
  const allValues = stackedDataPoints.flatMap((series) => series.flatMap((d) => [d[0], d[1]]));

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(allYears) as [number, number])
    .range([0, dimensions.INNER_WIDTH]);

  const [yMin, yMax] = d3.extent(allValues) as [number, number];
  const yPadding = (yMax - yMin) * 0.125;
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax + yPadding])
    .range([dimensions.INNER_HEIGHT, 0]);

  const area = d3
    .area<d3.SeriesPoint<StackedDataPoint>>()
    .x((d) => xScale(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveCardinal);

  renderGridLines(g, yScale, dimensions.INNER_WIDTH);
  renderAxes({
    groupSelection: g,
    scales: { xScale, yScale },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: allYears,
    yUnitText: runs[0].unit,
  });

  g.selectAll(".stacked-area")
    .data(stackedDataPoints)
    .enter()
    .append("path")
    .attr("class", "stacked-area")
    .attr("d", area)
    .attr("fill", (d) => variableColorMap.get(d.key) || colors[0])
    .attr("opacity", 0.8);

  const { verticalHoverLine } = createHoverElements(g, dimensions.INNER_HEIGHT);
  const dataByYear = new Map(dataPoints.map((d) => [d.year, d]));

  const updateHoverState = (targetYear: number | null) => {
    if (targetYear === null) {
      verticalHoverLine.style("opacity", 0);
      tooltipManager.hide();
      return;
    }

    const dataPoint = dataByYear.get(targetYear);
    if (!dataPoint) return;

    const x = xScale(dataPoint.year);
    verticalHoverLine.style("opacity", 1).attr("x1", x).attr("x2", x);

    let cumulative = 0;
    const tooltipData = presentVariables
      .map((variableName) => {
        const value = dataPoint[variableName] || 0;
        const start = cumulative;
        cumulative += value;
        return {
          key: variableName,
          value,
          start,
          end: cumulative,
          color: variableColorMap.get(variableName) || colors[0],
        };
      })
      .reverse();

    const content = tooltipData
      .map(
        (d) =>
          `<div class="flex items-center gap-2 mb-1">
            <div class="border border-foreground" style="width: 10px; height: 10px; background-color: ${d.color}; border-radius: 100px; flex-shrink: 0;"></div>
            <div class="text-black">
              <strong>${variablesMap[d.key] || d.key}:</strong> ${formatNumber(d.value)}
            </div>
          </div>`,
      )
      .join("");

    tooltipManager.show();
    tooltipManager.update(
      `<div class="text-black">
        <div class="mb-1"><strong>Year:</strong> ${dataPoint.year}</div>
        <div class="mb-2"><strong>Total sum:</strong> ${formatNumber(cumulative)}</div>
        <div>${content}</div>
      </div>`,
      x,
      dimensions.INNER_HEIGHT / 2,
    );
  };

  createInteractionOverlay(g, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT)
    .on("mouseleave", () => {
      window.dispatchEvent(new CustomEvent("sync-plot-hover", { detail: { year: null } }));
    })
    .on("mousemove", function (event) {
      const [mouseX] = d3.pointer(event);
      const year = Math.round(xScale.invert(mouseX));
      const nearestYear = allYears.reduce((prev, curr) =>
        Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev,
      );

      window.dispatchEvent(new CustomEvent("sync-plot-hover", { detail: { year: nearestYear } }));
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
