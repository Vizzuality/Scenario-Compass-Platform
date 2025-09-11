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
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";
import { createHoverElements } from "@/components/plots/utils/create-hover-elements";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
}

interface StackedDataPoint {
  year: number;

  [key: string]: number;
}

const getColorsFromRuns = (runs: ExtendedRun[], variableCount: number): string[] => {
  const firstRun = runs[0];
  const categoryKey = firstRun.flagCategory as keyof typeof CATEGORY_CONFIG;
  const palette = CATEGORY_CONFIG[categoryKey].palette;
  return [...palette].reverse().slice(0, variableCount);
};

export const renderStackedAreaPlot = ({ svg, runs, dimensions }: Props): void => {
  clearSVG(svg);

  if (runs.length === 0) {
    return;
  }

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  const variableNames = [...new Set(runs.map((run) => run.variableName))].sort();

  const allYears = [...new Set(runs.flatMap((run) => run.orderedPoints.map((p) => p.year)))].sort(
    (a, b) => a - b,
  );

  const keys = variableNames;
  const colors = getColorsFromRuns(runs, variableNames.length);

  const data: StackedDataPoint[] = allYears.map((year) => {
    const dataPoint: StackedDataPoint = { year };

    runs.forEach((run) => {
      const point = run.orderedPoints.find((p) => p.year === year);
      dataPoint[run.variableName] = point?.value || 0;
    });

    return dataPoint;
  });

  const stackedData = d3.stack<StackedDataPoint>().keys(keys)(data);

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
    g,
    scales: { xScale, yScale },
    height: dimensions.INNER_HEIGHT,
    width: dimensions.INNER_WIDTH,
    xTickValues: allYears,
  });

  g.selectAll(".stacked-area")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "stacked-area")
    .attr("d", area)
    .attr("fill", (d, i) => colors[i])
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
      g.selectAll(".stacked-area").attr("opacity", 0.8);
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
      const tooltipData = keys.map((key, i) => {
        const value = dataPoint[key];
        const start = cumulative;
        cumulative += value;
        return { key, value, start, end: cumulative, color: colors[i] };
      });
      const total = cumulative;

      tooltipData.reverse();

      const content = tooltipData
        .map(
          (d) =>
            `<div class="flex items-center gap-2 mb-1">
        <div class="border border-foreground" style="width: 10px; height: 10px; background-color: ${d.color}; border-radius: 100px; flex-shrink: 0;" ></div>
        <div class="text-black">
          <strong>${d.key.split("|").slice(1).join("|")}:</strong> ${formatNumber(d.value)}
        </div>
      </div>`,
        )
        .join("");

      tooltipManager?.update(
        `<div class="text-black">
          <div class="mb-1"> <strong>Year: </strong>  ${dataPoint.year}</div>
          <div class="mb-2"> <strong> Total sum:</strong>  ${formatNumber(total)}</div>
          <ul class="list-disc pl-4">${content}</ul>
        </div>`,
        x,
        dimensions.INNER_HEIGHT / 2,
      );
    });
};
