import { AggregatedDataPoint, ProcessedAreaData } from "@/types/data/data-point";
import * as d3 from "d3";
import { FONT_SIZE, GRID_STROKE_COLOR, GRID_TEXT_COLOR } from "@/lib/config/plots/plots-constants";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { ShortDataPoint } from "@/types/data/run";
import { calculateOptimalTicksWithNiceYears } from "@/utils/plots/ticks-computation";
import { formatShortenedNumber } from "@/utils/plots/format-functions";

export type SVGSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type GroupSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export interface PlotScales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export interface PlotDomain {
  xDomain: [number, number];
  yDomain: [number, number];
}

export const aggregateDataByYear = (dataPoints: ShortDataPoint[]): AggregatedDataPoint[] => {
  const groupedByYear = d3.group(dataPoints, (d) => d.year);
  const aggregatedData: AggregatedDataPoint[] = [];

  groupedByYear.forEach((values, year) => {
    const valuesArray = values.map((d) => d.value);
    aggregatedData.push({
      year,
      min: d3.min(valuesArray)!,
      max: d3.max(valuesArray)!,
      average: d3.mean(valuesArray)!,
      median: d3.median(valuesArray)!,
    });
  });

  return aggregatedData.sort((a, b) => a.year - b.year);
};

export const clearSVG = (svg: SVGSelection): void => {
  svg.selectAll("*").remove();
};

export const createMainGroup = (svg: SVGSelection, dimensions: PlotDimensions): GroupSelection => {
  const { MARGIN } = dimensions;
  return svg.append("g").attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);
};

export const calculateDomain = (points: ShortDataPoint[]): PlotDomain => {
  const xDomain = d3.extent(points, (d) => d.year) as [number, number];
  const yDomain = d3.extent(points, (d) => d.value) as [number, number];
  return { xDomain, yDomain };
};

export const createScales = (domain: PlotDomain, width: number, height: number): PlotScales => {
  const xScale = d3.scaleLinear().domain(domain.xDomain).range([0, width]);
  const yScale = d3.scaleLinear().domain(domain.yDomain).range([height, 0]);
  return { xScale, yScale };
};

export const renderGridLines = (
  g: GroupSelection,
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  tickCount: number = 6,
): void => {
  g.selectAll(".grid-line")
    .data(yScale.ticks(tickCount))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", yScale)
    .attr("y2", yScale)
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);
};

export const renderAxes = ({
  groupSelection,
  scales,
  height,
  width,
  yTickCount = 5,
  xTickValues,
  yUnitText,
  xUnitText,
}: {
  groupSelection: GroupSelection;
  scales: PlotScales;
  height: number;
  width?: number;
  xTickValues?: number[];
  yTickCount?: number;
  yUnitText?: string;
  xUnitText?: string;
}): void => {
  const optimizedXTickValues =
    xTickValues && width ? calculateOptimalTicksWithNiceYears(xTickValues, width) : undefined;

  const xAxisGenerator = optimizedXTickValues
    ? d3.axisBottom(scales.xScale).tickValues(optimizedXTickValues).tickFormat(d3.format("d"))
    : d3.axisBottom(scales.xScale).tickFormat(d3.format("d"));

  const xAxis = groupSelection
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxisGenerator);

  const yAxisGenerator = d3
    .axisLeft(scales.yScale)
    .tickFormat((d) => formatShortenedNumber(Number(d)));

  if (yTickCount !== undefined) {
    yAxisGenerator.ticks(yTickCount);
  }

  const yAxis = groupSelection.append("g").attr("class", "y-axis").call(yAxisGenerator);

  [xAxis, yAxis].forEach((axis) => {
    axis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
    axis.selectAll("text").style("font-size", FONT_SIZE).style("fill", GRID_TEXT_COLOR);
  });

  groupSelection
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -45)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .html(yUnitText ? yUnitText : "Value");

  if (width) {
    groupSelection
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", FONT_SIZE)
      .style("fill", GRID_TEXT_COLOR)
      .text(xUnitText ? xUnitText : "Year");
  }
};

export const createInteractionOverlay = (
  g: GroupSelection,
  width: number,
  height: number,
): d3.Selection<SVGRectElement, unknown, null, undefined> => {
  return g
    .append("rect")
    .attr("class", "interaction-overlay")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .style("cursor", "crosshair");
};

export const findClosestDataPoint = <T extends { year: number }>(
  mouseX: number,
  xScale: d3.ScaleLinear<number, number>,
  data: T[],
): T | null => {
  if (data.length === 0) return null;

  const year = xScale.invert(mouseX);
  return data.reduce((closestElement, currentElement) => {
    return Math.abs(currentElement.year - year) < Math.abs(closestElement.year - year)
      ? currentElement
      : closestElement;
  }, data[0]);
};

export const createLineGenerator = (scales: PlotScales): d3.Line<ShortDataPoint> => {
  return d3
    .line<ShortDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.value));
};

export const processAreaChartData = (dataPoints: ShortDataPoint[]): ProcessedAreaData => {
  const aggregatedData = aggregateDataByYear(dataPoints);

  const xDomain = d3.extent(aggregatedData, (d) => d.year) as [number, number];
  const yMin = d3.min(aggregatedData, (d) => d.min)!;
  const yMax = d3.max(aggregatedData, (d) => d.max)!;

  return {
    aggregatedData,
    xDomain,
    yDomain: [yMin, yMax],
  };
};
