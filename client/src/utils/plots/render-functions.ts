import { AggregatedDataPoint, ProcessedAreaData } from "@/types/data/data-point";
import * as d3 from "d3";
import { FONT_SIZE, GRID_STROKE_COLOR, GRID_TEXT_COLOR } from "@/lib/config/plots/plots-constants";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { ExtendedRun, ShortDataPoint } from "@/types/data/run";
import { calculateOptimalTicksWithNiceYears } from "@/utils/plots/ticks-computation";
import { formatShortenedNumber } from "@/utils/plots/format-functions";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";
import { ENSEMBLE_WEIGHT_SCI_2025_BETA } from "@/lib/config/filters/required-meta-keys";

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

const getSciEnsembleWeight = (run: ExtendedRun): number | null => {
  const indicator = run.metaIndicators.find(({ key }) => key === ENSEMBLE_WEIGHT_SCI_2025_BETA);
  if (!indicator) return null;

  const weight = Number(indicator.value);
  return Number.isFinite(weight) && weight > 0 ? weight : null;
};

const calculateWeightedPercentile = (
  values: Array<{ value: number; weight: number }>,
  percentile: number,
): number | undefined => {
  const validValues = values
    .filter(({ value, weight }) => Number.isFinite(value) && Number.isFinite(weight) && weight > 0)
    .sort((a, b) => a.value - b.value);

  if (validValues.length === 0) return undefined;

  const totalWeight = d3.sum(validValues, ({ weight }) => weight);
  const threshold = totalWeight * percentile;
  let cumulativeWeight = 0;

  for (const item of validValues) {
    cumulativeWeight += item.weight;
    if (cumulativeWeight >= threshold) return item.value;
  }

  return validValues.at(-1)?.value;
};

type SciWeightedStatsByYear = Pick<
  AggregatedDataPoint,
  "year" | "sciWeightedP05" | "sciWeightedP95" | "sciWeightedMedian"
>;

const calculateSciWeightedStatsByYear = (runs: ExtendedRun[]): SciWeightedStatsByYear[] => {
  const weightedValuesByYear = new Map<number, Array<{ value: number; weight: number }>>();

  runs.forEach((run) => {
    const weight = getSciEnsembleWeight(run);
    if (!weight) return;

    run.orderedPoints.forEach((point) => {
      if (!weightedValuesByYear.has(point.year)) {
        weightedValuesByYear.set(point.year, []);
      }
      weightedValuesByYear.get(point.year)!.push({ value: point.value, weight });
    });
  });

  return [...weightedValuesByYear.entries()]
    .map(([year, values]) => {
      return {
        year,
        sciWeightedP05: calculateWeightedPercentile(values, 0.05),
        sciWeightedP95: calculateWeightedPercentile(values, 0.95),
        sciWeightedMedian: calculateWeightedPercentile(values, 0.5),
      };
    })
    .sort((a, b) => a.year - b.year);
};

export const addSciWeightedStats = (
  aggregatedData: AggregatedDataPoint[],
  runs: ExtendedRun[],
): AggregatedDataPoint[] => {
  const weightedDataByYear = new Map(
    calculateSciWeightedStatsByYear(runs).map((point) => [point.year, point]),
  );

  return aggregatedData.map((point) => {
    const weightedPoint = weightedDataByYear.get(point.year);
    if (!weightedPoint) return point;

    return {
      ...point,
      sciWeightedP05: weightedPoint.sciWeightedP05,
      sciWeightedP95: weightedPoint.sciWeightedP95,
      sciWeightedMedian: weightedPoint.sciWeightedMedian,
    };
  });
};

export const clearSVG = (svg: SVGSelection): void => {
  svg.selectAll("*").remove();
};

export const createMainGroup = (svg: SVGSelection, dimensions: PlotDimensions): GroupSelection => {
  const { MARGIN } = dimensions;
  return svg.append("g").attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);
};

export const calculateDomain = (points: ShortDataPoint[], yExtent?: YExtentPair): PlotDomain => {
  const xDomain = d3.extent(points, (d) => d.year) as [number, number];

  let yDomain: [number, number];

  if (yExtent) {
    const padding = (yExtent.yMax - yExtent.yMin) * 0.1;
    yDomain = [yExtent.yMin - padding, yExtent.yMax + padding];
  } else {
    const [yMin, yMax] = d3.extent(points, (d) => d.value) as [number, number];
    const padding = (yMax - yMin) * 0.1;
    yDomain = [yMin - padding, yMax + padding];
  }

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
  yTickCount = 6,
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
    .attr("y", -40)
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
      .attr("y", height + 35)
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

/**
 * Linear interpolation across a unified year axis.
 *
 * Given a run that only contains data for certain years, this function
 * produces a new run whose points cover *every* year in `allYears`.
 *
 * - Years already present in the run are passed through unchanged.
 * - Years that fall between two known years are linearly interpolated.
 * - Years that fall entirely outside the run's range (no known year on
 *   one or both sides) are dropped — extrapolation is not performed.
 */
export function interpolatePoints(run: ExtendedRun, allYears: number[]): ExtendedRun {
  const knownValueByYear: Map<number, number> = new Map(
    run.orderedPoints.map((point) => [point.year, point.value]),
  );

  // Extract and sort the years we have actual data for, so we can find neighbors efficiently
  const knownYearsAscending: number[] = run.orderedPoints
    .map((point) => point.year)
    .sort((a, b) => a - b);

  const interpolatedPoints = allYears
    .map((targetYear) => {
      // 1. If the run already has a value for this year, use it directly.
      if (knownValueByYear.has(targetYear)) {
        return { year: targetYear, value: knownValueByYear.get(targetYear)! };
      }

      // 2. Find the closest known year on each side of the target year.
      const nearestYearBefore = knownYearsAscending.filter((year) => year < targetYear).at(-1);
      const nearestYearAfter = knownYearsAscending.find((year) => year > targetYear);

      // 3. If the target year is outside the run's range skip it
      if (nearestYearBefore === undefined || nearestYearAfter === undefined) {
        return null;
      }

      // 4. Compute the interpolation weight `t` — how far targetYear sits between its two neighbours, expressed as a 0‒1 fraction.
      const t = (targetYear - nearestYearBefore) / (nearestYearAfter - nearestYearBefore);

      const valueAtYearBefore = knownValueByYear.get(nearestYearBefore)!;
      const valueAtYearAfter = knownValueByYear.get(nearestYearAfter)!;

      // 5. Standard lerp formula:  result = start + (end - start) * t
      const interpolatedValue = valueAtYearBefore + (valueAtYearAfter - valueAtYearBefore) * t;

      return { year: targetYear, value: interpolatedValue };
    })
    .filter((point) => point !== null);

  return { ...run, orderedPoints: interpolatedPoints };
}

export const computeAreaChartDomains = (
  dataPoints: ShortDataPoint[],
  yExtent?: YExtentPair,
): ProcessedAreaData => {
  const aggregatedData = aggregateDataByYear(dataPoints);
  const xDomain = d3.extent(aggregatedData, (d) => d.year) as [number, number];

  let yDomain: [number, number];

  if (yExtent) {
    const padding = (yExtent.yMax - yExtent.yMin) * 0.1;
    yDomain = [yExtent.yMin - padding, yExtent.yMax + padding];
  } else {
    const yMin = d3.min(aggregatedData, (d) => d.min)!;
    const yMax = d3.max(aggregatedData, (d) => d.max)!;
    const padding = (yMax - yMin) * 0.1;
    yDomain = [yMin - padding, yMax + padding];
  }

  return {
    aggregatedData,
    xDomain,
    yDomain,
  };
};
