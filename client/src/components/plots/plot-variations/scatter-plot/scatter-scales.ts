import * as d3 from "d3";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { FigureOneDataPoint } from "@/hooks/guided-exploration/figure-one/use-figure-one";
import { renderGridLines } from "@/utils/plots/render-functions";

export interface ScatterScales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  fullXDomain: [number, number];
  fullYDomain: [number, number];
}

export const createScatterScales = (
  points: FigureOneDataPoint[],
  dimensions: PlotDimensions,
): ScatterScales => {
  const solarExtent = d3.extent(points, (d) => d.xValue) as [number, number];
  const windExtent = d3.extent(points, (d) => d.yValue) as [number, number];

  const xPadding = (solarExtent[1] - solarExtent[0]) * 0.05 || 1;
  const yPadding = (windExtent[1] - windExtent[0]) * 0.05 || 1;

  const fullXDomain: [number, number] = [solarExtent[0] - xPadding, solarExtent[1] + xPadding];
  const fullYDomain: [number, number] = [windExtent[0] - yPadding, windExtent[1] + yPadding];

  const xScale = d3.scaleLinear().domain(fullXDomain).range([0, dimensions.INNER_WIDTH]);
  const yScale = d3.scaleLinear().domain(fullYDomain).range([dimensions.INNER_HEIGHT, 0]);

  return { xScale, yScale, fullXDomain, fullYDomain };
};

export const renderScatterAxes = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  scales: ScatterScales,
  dimensions: PlotDimensions,
) => {
  const { xScale, yScale } = scales;

  renderGridLines(g, yScale, dimensions.INNER_WIDTH);

  const xAxisGroup = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${dimensions.INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).ticks(6));

  xAxisGroup
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", dimensions.INNER_WIDTH / 2)
    .attr("y", 40)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Solar Capacity (GW)");

  const yAxisGroup = g.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale).ticks(6));

  yAxisGroup
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -dimensions.INNER_HEIGHT / 2)
    .attr("y", -50)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Wind Capacity (GW)");

  return { xAxisGroup, yAxisGroup };
};

export const updateScatterAxes = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  scales: ScatterScales,
  dimensions: PlotDimensions,
  dotsGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  brushGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null,
) => {
  const { xScale, yScale } = scales;

  xAxisGroup.call(d3.axisBottom(xScale).ticks(6));
  xAxisGroup.select(".x-axis-label").remove();
  xAxisGroup
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", dimensions.INNER_WIDTH / 2)
    .attr("y", 40)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Solar Capacity (GW)");

  yAxisGroup.call(d3.axisLeft(yScale).ticks(6));
  yAxisGroup.select(".y-axis-label").remove();
  yAxisGroup
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -dimensions.INNER_HEIGHT / 2)
    .attr("y", -50)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Wind Capacity (GW)");

  g.selectAll(".grid-line").remove();
  renderGridLines(g, yScale, dimensions.INNER_WIDTH);
  dotsGroup.raise();
  if (brushGroup) brushGroup.raise();
};
