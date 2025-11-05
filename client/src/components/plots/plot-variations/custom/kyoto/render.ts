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
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { createHoverElements } from "@/utils/plots/create-hover-elements";
import { ShortRun, ShortRunReturn } from "@/components/plots/plot-variations/custom/kyoto/types";
import { ShortDataPoint } from "@/types/data/run";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";
import { getColorsForVariables } from "@/utils/plots/colors-functions";
import { LIGHT_GREY, OTHER_GASES } from "@/lib/config/plots/plots-constants";
import { formatNumber } from "@/utils/plots/format-functions";

interface Props {
  svg: SVGSelection;
  data: ShortRunReturn;
  dimensions: PlotDimensions;
}

interface StackedDataPoint {
  year: number;
  [key: string]: number;
}

export const getOrderedVariableNames = (runs: ShortRun[]): string[] => {
  const variableNames = [...new Set(runs.map((run) => run.variableName))];
  return variableNames.sort((a, b) => a.localeCompare(b));
};

export const renderKyotoPlot = ({ svg, data, dimensions }: Props): void => {
  clearSVG(svg);
  const { shortRuns, flagCategory } = data;
  if (shortRuns.length === 0) {
    return;
  }

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  const areaRuns = shortRuns.filter((run) => !run.isLine);
  const lineRuns = shortRuns.filter((run) => run.isLine);

  const areaVariableNames = getOrderedVariableNames(areaRuns);

  const nonOtherGasVariables = areaVariableNames.filter((name) => name !== "Other Gases");
  const colors = getColorsForVariables(flagCategory, nonOtherGasVariables.length);

  const variableColorMap = new Map<string, string>();
  nonOtherGasVariables.forEach((variableName, index) => {
    variableColorMap.set(variableName, colors[index]);
  });
  variableColorMap.set(OTHER_GASES, LIGHT_GREY);

  const lineColor = CATEGORY_CONFIG[flagCategory].palette;

  const allYears = [
    ...new Set(shortRuns.flatMap((run) => run.orderedPoints.map((p) => p.year))),
  ].sort((a, b) => a - b);

  const stackedAreaData: StackedDataPoint[] = allYears.map((year) => {
    const dataPoint: StackedDataPoint = { year };

    areaRuns.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      dataPoint[run.variableName] = point?.value || 0;
    });

    return dataPoint;
  });

  const lineData = lineRuns.map((run) => ({
    variableName: run.variableName,
    points: run.orderedPoints,
  }));

  const allAreaValues =
    stackedAreaData.length > 0
      ? d3
          .stack<StackedDataPoint>()
          .keys(areaVariableNames)(stackedAreaData)
          .flatMap((series) => series.flatMap((d) => [d[0], d[1]]))
      : [];

  const allLineValues = lineRuns.flatMap((run) => run.orderedPoints.map((p) => p.value));
  const allValues = [...allAreaValues, ...allLineValues];

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(allYears) as [number, number])
    .range([0, dimensions.INNER_WIDTH]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(allValues) as [number, number])
    .range([dimensions.INNER_HEIGHT, 0]);

  renderGridLines(g, yScale, dimensions.INNER_WIDTH);
  renderAxes({
    groupSelection: g,
    scales: { xScale, yScale },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: allYears,
    unit: "Mt CO2eq/yr",
  });

  if (stackedAreaData.length > 0 && areaVariableNames.length > 0) {
    const stackedData = d3.stack<StackedDataPoint>().keys(areaVariableNames)(stackedAreaData);

    const area = d3
      .area<d3.SeriesPoint<StackedDataPoint>>()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveCardinal);

    g.selectAll(".stacked-area")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "stacked-area")
      .attr("d", area)
      .attr("fill", (d) => variableColorMap.get(d.key) || colors[0])
      .attr("opacity", 0.8);
  }

  if (lineData.length > 0) {
    const line = d3
      .line<ShortDataPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveCardinal);

    g.selectAll(".line-path")
      .data(lineData)
      .enter()
      .append("path")
      .attr("class", "line-path")
      .attr("d", (d) => line(d.points))
      .attr("fill", "none")
      .attr("stroke", lineColor[0])
      .attr("stroke-width", 2);
  }

  const { verticalHoverLine } = createHoverElements(g, dimensions.INNER_HEIGHT);

  const dataByYear = new Map<
    number,
    { year: number; areas: Record<string, number>; lines: Record<string, number> }
  >();

  allYears.forEach((year) => {
    const areas: Record<string, number> = {};
    const lines: Record<string, number> = {};

    areaRuns.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      areas[run.variableName] = point?.value || 0;
    });

    lineRuns.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      if (point) {
        lines[run.variableName] = point.value;
      }
    });

    dataByYear.set(year, { year, areas, lines });
  });

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
        const availableYears = Array.from(dataByYear.keys());
        const closestYear = availableYears.reduce((prev, curr) =>
          Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev,
        );
        dataPoint = dataByYear.get(closestYear);
      }

      if (!dataPoint) return;

      const x = xScale(dataPoint.year);
      verticalHoverLine.attr("x1", x).attr("x2", x);

      let cumulative = 0;
      const areaTooltipData = areaVariableNames
        .map((variableName) => {
          const value = dataPoint.areas[variableName] || 0;
          const start = cumulative;
          cumulative += value;
          return {
            key: variableName,
            value,
            start,
            end: cumulative,
            color: variableColorMap.get(variableName) || colors[0],
            isLine: false,
          };
        })
        .reverse();

      const lineTooltipData = lineRuns
        .filter((run) => dataPoint.lines[run.variableName] !== undefined)
        .map((run) => ({
          key: run.variableName,
          value: dataPoint.lines[run.variableName],
          color: lineColor[0],
          isLine: true,
        }));

      const allTooltipData = [...areaTooltipData, ...lineTooltipData];

      const content = allTooltipData
        .sort((a, b) => Number(b.isLine) - Number(a.isLine))
        .map((d) => {
          const legendElement = d.isLine
            ? `<div style="width: 10px; height: 3px; background-color: ${d.color}; flex-shrink: 0;"></div>`
            : `<div style="width: 10px; height: 10px; background-color: ${d.color}; border: 1px solid #666; border-radius: 100px; flex-shrink: 0;"></div>`;

          return `<div class="flex items-center gap-2 mb-1">
      ${legendElement}
      <div class="text-black">
        <strong>${d.key}:</strong> ${formatNumber(d.value)}
      </div>
    </div>`;
        })
        .join("");

      tooltipManager?.update(
        `<div class="text-black">
          <div class="mb-1"><strong>Year:</strong> ${dataPoint.year}</div>
          <div>${content}</div>
        </div>`,
        x,
        dimensions.INNER_HEIGHT / 2,
      );
    });
};
