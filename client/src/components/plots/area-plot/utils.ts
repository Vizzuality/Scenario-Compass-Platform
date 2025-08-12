import * as d3 from "d3";
import { AggregatedDataPoint, ProcessedAreaData } from "@/components/plots/types/plots";
import { GRID_STROKE_COLOR, GRID_TEXT_COLOR, PlotDimensions } from "@/components/plots/utils/chart";
import { ExtendedRun, ShortDataPoint } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";

const aggregateDataByYear = (dataPoints: ShortDataPoint[]): AggregatedDataPoint[] => {
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

export const renderAreaPlot = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  aggregatedData: AggregatedDataPoint[],
  xDomain: [number, number],
  yDomain: [number, number],
  dimensions: PlotDimensions,
) => {
  svg.selectAll("*").remove();
  const { INNER_WIDTH, INNER_HEIGHT, MARGIN } = dimensions;

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const xScale = d3.scaleLinear().domain(xDomain).range([0, INNER_WIDTH]);
  const yScale = d3.scaleLinear().domain(yDomain).range([INNER_HEIGHT, 0]);

  g.selectAll(".grid-line")
    .data(yScale.ticks(6))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", INNER_WIDTH)
    .attr("y1", yScale)
    .attr("y2", yScale)
    .attr("stroke", "#E7E5E4")
    .attr("stroke-width", 1);

  const area = d3
    .area<AggregatedDataPoint>()
    .x((d) => xScale(d.year))
    .y0((d) => yScale(d.min))
    .y1((d) => yScale(d.max))
    .curve(d3.curveMonotoneX);

  const line = d3
    .line<AggregatedDataPoint>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.average))
    .curve(d3.curveMonotoneX);

  g.append("path").datum(aggregatedData).attr("fill", "rgba(68, 64, 60, 0.10)").attr("d", area);

  g.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", "#44403C")
    .attr("stroke-width", 1.37)
    .attr("d", line);

  const xAxis = g
    .append("g")
    .attr("transform", `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  const yAxis = g.append("g").call(d3.axisLeft(yScale).ticks(6));

  xAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
  yAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
  yAxis.selectAll("text").style("fill", GRID_TEXT_COLOR).style("font-size", "10px");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -INNER_HEIGHT / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", GRID_TEXT_COLOR)
    .text("Value");
};
