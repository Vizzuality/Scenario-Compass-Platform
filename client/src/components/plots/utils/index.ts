import { AggregatedDataPoint, ProcessedAreaData } from "@/components/plots/types";
import * as d3 from "d3";
import {
  FONT_SIZE,
  GREY,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  LIGHT_GREY,
} from "@/components/plots/utils/constants";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import {
  CATEGORY_CONFIG,
  getCategoryAbbrev,
} from "@/lib/config/reasons-of-concern/category-config";
import { ExtendedRun, ShortDataPoint } from "@/hooks/runs/pipeline/types";

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

export const formatShortenedNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    const millions = value / 1000000;
    return millions % 1 === 0 ? millions + "M" : millions.toFixed(1) + "M";
  } else if (Math.abs(value) >= 1000) {
    const thousands = value / 1000;
    return thousands % 1 === 0 ? thousands + "k" : thousands.toFixed(1) + "k";
  } else {
    return value.toString();
  }
};

export const formatNumber = (value: number, precision: number = 2): string => {
  if (Math.abs(value) >= 1e6) {
    return d3.format(`.${precision}s`)(value);
  } else if (Math.abs(value) >= 1000) {
    return d3.format(",.0f")(value);
  } else {
    return d3.format(`.${precision}~f`)(value);
  }
};

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

const calculateOptimalTicksWithNiceYears = (years: number[], availableWidth: number): number[] => {
  const MIN_TICK_SPACING = 50;
  const maxTicks = Math.floor(availableWidth / MIN_TICK_SPACING);

  if (years.length <= 2) return years;
  if (years.length <= maxTicks) return years;

  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const middleTicks = maxTicks - 2;

  if (middleTicks <= 0) {
    return [firstYear, lastYear];
  }

  // Try to find nice intervals (multiples of 5, 10, etc.)
  const middleYears = years.slice(1, -1);
  const intervals = [5, 10, 20, 25];

  for (const interval of intervals) {
    const niceYears = middleYears.filter((year) => year % interval === 0);
    if (niceYears.length > 0 && niceYears.length <= middleTicks) {
      return [firstYear, ...niceYears, lastYear];
    }
  }

  const step = Math.ceil(middleYears.length / middleTicks);
  const selectedMiddleYears = middleYears.filter((_, index) => index % step === 0);

  return [firstYear, ...selectedMiddleYears, lastYear];
};

export const renderAxes = ({
  g,
  scales,
  height,
  width,
  yTickCount = 5,
  xTickValues,
  unit,
}: {
  g: GroupSelection;
  scales: PlotScales;
  height: number;
  width?: number;
  xTickValues?: number[];
  yTickCount?: number;
  unit?: string;
}): void => {
  const optimizedXTickValues =
    xTickValues && width ? calculateOptimalTicksWithNiceYears(xTickValues, width) : undefined;

  const xAxisGenerator = optimizedXTickValues
    ? d3.axisBottom(scales.xScale).tickValues(optimizedXTickValues).tickFormat(d3.format("d"))
    : d3.axisBottom(scales.xScale).tickFormat(d3.format("d"));

  const xAxis = g
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

  const yAxis = g.append("g").attr("class", "y-axis").call(yAxisGenerator);

  [xAxis, yAxis].forEach((axis) => {
    axis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
    axis.selectAll("text").style("font-size", FONT_SIZE).style("fill", GRID_TEXT_COLOR);
  });

  g.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -45)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .html(unit ? unit : "Value");
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

export const getRunColor = (
  run: ExtendedRun,
  selectedFlags: string[],
  hasSelection: boolean,
): string => {
  if (!run.flagCategory) {
    return hasSelection ? LIGHT_GREY : GREY;
  }

  const abbrev = getCategoryAbbrev(run.flagCategory);

  if (abbrev && selectedFlags.includes(abbrev)) {
    const categoryKey = run.flagCategory as keyof typeof CATEGORY_CONFIG;
    const color = CATEGORY_CONFIG[categoryKey]?.color;
    return color || GREY;
  }

  return hasSelection ? LIGHT_GREY : GREY;
};

export const filterVisibleRuns = (runs: ExtendedRun[], hiddenFlags: string[]): ExtendedRun[] => {
  if (hiddenFlags.length === 0) return runs;

  return runs.filter((run) => {
    if (!run.flagCategory) return true;
    const abbrev = getCategoryAbbrev(run.flagCategory);
    return !abbrev || !hiddenFlags.includes(abbrev);
  });
};
