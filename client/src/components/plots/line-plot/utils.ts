import * as d3 from "d3";
import {
  GREY,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  LIGHT_GREY,
} from "@/components/plots/utils/constants";
import { ExtendedRun, ShortDataPoint } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/chart";
import {
  CATEGORY_CONFIG,
  getCategoryAbbrev,
} from "@/containers/scenario-dashboard/utils/category-config";

const getRunColor = (run: ExtendedRun, selectedFlags: string[], hasSelection: boolean) => {
  if (!run.flagCategory) {
    return hasSelection ? LIGHT_GREY : GREY;
  }

  const abbrev = getCategoryAbbrev(run.flagCategory);

  if (abbrev && selectedFlags.includes(abbrev)) {
    const color = CATEGORY_CONFIG[run.flagCategory as keyof typeof CATEGORY_CONFIG]?.color;
    return color || GREY;
  }

  return hasSelection ? LIGHT_GREY : GREY;
};

const filterVisibleRuns = (runs: ExtendedRun[], hiddenFlags: string[]) => {
  if (hiddenFlags.length === 0) return runs;

  return runs.filter((run) => {
    if (!run.flagCategory) return true;

    const abbrev = getCategoryAbbrev(run.flagCategory);

    return !abbrev || !hiddenFlags.includes(abbrev);
  });
};

export const renderLinePlot = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  runs: ExtendedRun[],
  selectedFlags: string[] = [],
  hiddenFlags: string[] = [],
) => {
  svg.selectAll("*").remove();

  const visibleRuns = filterVisibleRuns(runs, hiddenFlags);

  const { INNER_WIDTH, INNER_HEIGHT, MARGIN } = getPlotDimensions();
  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);
  const points = visibleRuns.flatMap((run) => run.points);

  const hasSelection = selectedFlags.length > 0;

  const xDomain = d3.extent(points, (d) => d.year) as [number, number];
  const yDomain = d3.extent(points, (d) => d.value) as [number, number];

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
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  const line = d3
    .line<ShortDataPoint>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  const xAxis = g
    .append("g")
    .attr("transform", `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  const yAxis = g.append("g").call(d3.axisLeft(yScale));

  xAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
  yAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -INNER_HEIGHT / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", GRID_TEXT_COLOR)
    .text("Value");

  visibleRuns.forEach((run, index) => {
    if (run.points && run.points.length > 0) {
      const sortedPoints = [...run.points].sort((a, b) => a.year - b.year);
      const color = getRunColor(run, selectedFlags, hasSelection);

      g.append("path")
        .datum(sortedPoints)
        .attr("class", `line-run-${index}`)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.7)
        .attr("d", line);
    }
  });
};
