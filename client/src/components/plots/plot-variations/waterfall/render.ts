import { clearSVG, createMainGroup, SVGSelection } from "@/utils/plots/render-functions";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import {
  createVariableColorMap,
  getActiveVariables,
  getColorsForVariables,
} from "@/utils/plots/colors-functions";
import { formatNumber, formatShortenedNumber } from "@/utils/plots/format-functions";
import { FONT_SIZE, GRID_STROKE_COLOR, GRID_TEXT_COLOR } from "@/lib/config/plots/plots-constants";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  variablesMap: Record<string, string>;
}

const STROKE_WIDTH = 1;
const BAR_PADDING = 0.15;

interface Segment {
  name: string;
  label: string;
  value: number;
  start: number;
  end: number;
  color: string;
}

export const renderStackedWaterfallPlot = ({
  svg,
  runs,
  dimensions,
  variablesMap,
}: Props): void => {
  clearSVG(svg);
  if (runs.length === 0) return;

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  const activeVariables = getActiveVariables(runs);
  const presentVariables = Object.keys(variablesMap).filter((v) => activeVariables.has(v));
  const colors = getColorsForVariables(runs[0].flagCategory, presentVariables.length);
  const variableColorMap = createVariableColorMap(presentVariables, colors);

  const year = runs[0].orderedPoints[0]?.year ?? 0;

  const values: Record<string, number> = {};
  presentVariables.forEach((varName) => {
    const matchingRun = runs.find((r) => r.variableName === varName);
    values[varName] = matchingRun?.orderedPoints[0]?.value ?? 0;
  });

  // Build segments
  const segments: Segment[] = [];
  let running = 0;

  presentVariables.forEach((varName) => {
    const value = values[varName];
    const start = running;
    const end = running + value;
    segments.push({
      name: varName,
      label: variablesMap[varName] ?? varName,
      value,
      start,
      end,
      color: variableColorMap.get(varName) ?? colors[0],
    });
    running = end;
  });

  const allY = segments.flatMap((s) => [s.start, s.end]);
  const yMin = Math.min(0, ...allY);
  const yMax = Math.max(0, ...allY);
  const yPadding = (yMax - yMin) * 0.2;

  const yScale = d3
    .scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([dimensions.INNER_HEIGHT, 0]);

  const xScale = d3
    .scaleBand()
    .domain(segments.map((s) => s.name))
    .range([0, dimensions.INNER_WIDTH])
    .padding(BAR_PADDING);

  const barWidth = xScale.bandwidth();

  // Grid lines
  g.selectAll(".grid-line")
    .data(yScale.ticks(6))
    .join("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", dimensions.INNER_WIDTH)
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d))
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  // Zero baseline
  g.append("line")
    .attr("x1", 0)
    .attr("x2", dimensions.INNER_WIDTH)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", GRID_TEXT_COLOR)
    .attr("opacity", 0.4)
    .attr("stroke-width", 0.5);

  // Y axis
  const yAxis = g
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((d) => formatShortenedNumber(Number(d))),
    );

  // X axis — no tick labels, legend handles it
  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${dimensions.INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).tickFormat(() => ""));

  [xAxis, yAxis].forEach((axis) => {
    axis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
    axis.selectAll("text").style("font-size", FONT_SIZE).style("fill", GRID_TEXT_COLOR);
  });

  // Y unit label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -dimensions.INNER_HEIGHT / 2)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .text(runs[0].unit ?? "Value");

  // x unit label
  g.append("text")
    .attr("x", dimensions.INNER_WIDTH / 2)
    .attr("y", dimensions.INNER_HEIGHT + 20)
    .attr("text-anchor", "middle")
    .style("font-size", FONT_SIZE)
    .style("fill", GRID_TEXT_COLOR)
    .text(year);

  // Bars + connectors
  segments.forEach((seg, i) => {
    const x = xScale(seg.name) ?? 0;
    const y = yScale(Math.max(seg.start, seg.end));
    const height = Math.abs(yScale(seg.start) - yScale(seg.end));
    const darkerColor = d3.color(seg.color)?.darker(0.8).toString() ?? seg.color;

    g.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", barWidth)
      .attr("height", height)
      .attr("fill", seg.color)
      .attr("opacity", 0.85)
      .attr("stroke", "none")
      .style("cursor", "pointer")
      .on("mouseenter", function () {
        d3.select(this)
          .attr("x", x + STROKE_WIDTH / 2)
          .attr("y", y + STROKE_WIDTH / 2)
          .attr("width", barWidth - STROKE_WIDTH)
          .attr("height", height - STROKE_WIDTH)
          .attr("opacity", 1)
          .attr("stroke", darkerColor)
          .attr("stroke-width", STROKE_WIDTH);

        tooltipManager?.show();
        tooltipManager?.update(
          `<div class="text-black flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div style="width:10px;height:10px;background:${seg.color};border-radius:100px;border:1px solid #666;flex-shrink:0"></div>
              <strong>${seg.label}</strong>
            </div>
            <div>Value: ${formatNumber(seg.value)} ${runs[0].unit ?? ""}</div>
            <div>Total: ${formatNumber(seg.end)} ${runs[0].unit ?? ""}</div>
          </div>`,
          x + barWidth / 2,
          y + height / 2,
        );
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("x", x)
          .attr("y", y)
          .attr("width", barWidth)
          .attr("height", height)
          .attr("opacity", 0.85)
          .attr("stroke", "none");

        tooltipManager?.hide();
      });

    // Connector to next bar
    if (i < segments.length - 1) {
      const nextSeg = segments[i + 1];
      const nextX = xScale(nextSeg.name) ?? 0;
      const connectorY = yScale(seg.end);

      g.append("line")
        .attr("x1", x + barWidth)
        .attr("x2", nextX)
        .attr("y1", connectorY)
        .attr("y2", connectorY)
        .attr("stroke", GRID_TEXT_COLOR)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3 2");
    }
  });
};
