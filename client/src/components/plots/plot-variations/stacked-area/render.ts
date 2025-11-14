import {
  clearSVG,
  createInteractionOverlay,
  createMainGroup,
  renderAxes,
  renderGridLines,
  SVGSelection,
} from "@/utils/plots/render-functions";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { createHoverElements } from "@/utils/plots/create-hover-elements";
import {
  createVariableColorMap,
  getColorsForVariables,
  getOrderedVariableNames,
} from "@/utils/plots/colors-functions";
import { formatNumber } from "@/utils/plots/format-functions";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  variablesMap: Record<string, string>;
}

interface StackedDataPoint {
  year: number;
  [key: string]: number;
}

export const renderStackedAreaPlot = ({ svg, runs, dimensions, variablesMap }: Props): void => {
  clearSVG(svg);

  if (runs.length === 0) {
    return;
  }

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  const variableNames = getOrderedVariableNames(runs);
  const colors = getColorsForVariables(runs[0].flagCategory, variableNames.length);
  const variableColorMap = createVariableColorMap(variableNames, colors);

  const allYears = [...new Set(runs.flatMap((run) => run.orderedPoints.map((p) => p.year)))].sort(
    (a, b) => a - b,
  );

  const data: StackedDataPoint[] = allYears.map((year) => {
    const dataPoint: StackedDataPoint = { year };

    runs.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      dataPoint[run.variableName] = point?.value || 0;
    });

    return dataPoint;
  });

  const stackedData = d3.stack<StackedDataPoint>().keys(variableNames)(data);
  const allValues = stackedData.flatMap((series) => series.flatMap((d) => [d[0], d[1]]));

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(allYears) as [number, number])
    .range([0, dimensions.INNER_WIDTH]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(allValues) as [number, number])
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
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "stacked-area")
    .attr("d", area)
    .attr("fill", (d) => variableColorMap.get(d.key) || colors[0])
    .attr("opacity", 0.8);

  const { verticalHoverLine } = createHoverElements(g, dimensions.INNER_HEIGHT);
  const dataByYear = new Map(data.map((d) => [d.year, d]));

  createInteractionOverlay(g, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT)
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

      let dataPoint = dataByYear.get(year);
      if (!dataPoint) {
        dataPoint = data.reduce((prev, curr) =>
          Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev,
        );
      }

      if (!dataPoint) return;

      const x = xScale(dataPoint.year);
      verticalHoverLine.attr("x1", x).attr("x2", x);

      let cumulative = 0;

      const tooltipData = variableNames
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

      const total = cumulative;

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

      tooltipManager?.update(
        `<div class="text-black">
          <div class="mb-1"><strong>Year:</strong> ${dataPoint.year}</div>
          <div class="mb-2"><strong>Total sum:</strong> ${formatNumber(total)}</div>
          <div>${content}</div>
        </div>`,
        x,
        dimensions.INNER_HEIGHT / 2,
      );
    });
};
