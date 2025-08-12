import { DataFrame } from "@iiasa/ixmp4-ts";
import { AggregatedDataPoint, DataPoint, ProcessedAreaData } from "@/components/plots/types";

export const extractDataPoints = (data: DataFrame | undefined): DataPoint[] | [] => {
  if (data === undefined) {
    return [];
  }

  const dataPoints: DataPoint[] = [];
  const [rows] = data.shape;
  const columns: string[] = data.columns;

  const scenarioCol = columns.find((col) => col.toLowerCase().includes("scenario"));
  const modelCol = columns.find((col) => col.toLowerCase().includes("model"));
  const yearCol = columns.find((col) => col.toLowerCase().includes("year"));
  const valueCol = columns.find((col) => col.toLowerCase().includes("value"));

  if (!scenarioCol || !yearCol || !valueCol || !modelCol) {
    console.error("Missing required columns: scenario, year, value or model");
    return [];
  }

  for (let i = 0; i < rows; i++) {
    const scenario = data.at(i, scenarioCol);
    const model = data.at(i, modelCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);

    if (scenario != null && year != null && value != null) {
      dataPoints.push({
        scenarioName: String(scenario),
        modelName: String(model),
        year: Number(year),
        value: Number(value),
      });
    }
  }

  return dataPoints;
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

import * as d3 from "d3";
import {
  FONT_SIZE,
  GREY,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  LIGHT_GREY,
} from "@/components/plots/utils/constants";
import { ExtendedRun, ShortDataPoint } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import {
  CATEGORY_CONFIG,
  getCategoryAbbrev,
} from "@/containers/scenario-dashboard/utils/category-config";

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
  g,
  scales,
  height,
  yTickCount = 5,
  xTickValues,
}: {
  g: GroupSelection;
  scales: PlotScales;
  height: number;
  xTickValues?: number[];
  yTickCount?: number;
}): void => {
  const xAxisGenerator = xTickValues
    ? d3.axisBottom(scales.xScale).tickValues(xTickValues).tickFormat(d3.format("d"))
    : d3.axisBottom(scales.xScale).tickFormat(d3.format("d"));

  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxisGenerator);

  const yAxisGenerator = d3.axisLeft(scales.yScale);

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
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .text("Value");
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

export const formatNumber = (value: number, precision: number = 2): string => {
  if (Math.abs(value) >= 1e6) {
    return d3.format(`.${precision}s`)(value);
  } else if (Math.abs(value) >= 1000) {
    return d3.format(",.0f")(value);
  } else {
    return d3.format(`.${precision}~f`)(value);
  }
};

export const createLineGenerator = (scales: PlotScales): d3.Line<ShortDataPoint> => {
  return d3
    .line<ShortDataPoint>()
    .x((d) => scales.xScale(d.year))
    .y((d) => scales.yScale(d.value));
};

export const processAreaChartData = (runs: ExtendedRun[]): ProcessedAreaData => {
  const dataPoints = runs.flatMap((run) => run.points);
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
