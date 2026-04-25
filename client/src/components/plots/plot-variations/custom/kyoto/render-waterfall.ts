import { clearSVG, createMainGroup, SVGSelection } from "@/utils/plots/render-functions";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import * as d3 from "d3";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { ShortRunReturn } from "@/components/plots/plot-variations/custom/kyoto/types";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";
import { getColorsForVariables } from "@/utils/plots/colors-functions";
import {
  FONT_SIZE,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  LIGHT_GREY,
  OTHER_GASES,
} from "@/lib/config/plots/plots-constants";
import { formatNumber, formatShortenedNumber } from "@/utils/plots/format-functions";
import { getOrderedVariableNames } from "./render";

interface Props {
  svg: SVGSelection;
  data: ShortRunReturn;
  dimensions: PlotDimensions;
}

const STROKE_WIDTH = 1;
const BAR_PADDING = 0.3;

export const renderKyotoWaterfallPlot = ({ svg, data, dimensions }: Props): void => {
  clearSVG(svg);
  const { shortRuns, flagCategory } = data;
  if (shortRuns.length === 0) return;

  const g = createMainGroup(svg, dimensions);
  const tooltipManager = createTooltipManager({ svg, dimensions });

  const areaRuns = shortRuns.filter((run) => !run.isLine);
  const lineRuns = shortRuns.filter((run) => run.isLine);

  const areaVariableNames = getOrderedVariableNames(areaRuns);
  const nonOtherGasVariables = areaVariableNames.filter((name) => name !== OTHER_GASES);
  const colors = getColorsForVariables(flagCategory, nonOtherGasVariables.length);

  const variableColorMap = new Map<string, string>();
  nonOtherGasVariables.forEach((name, i) => variableColorMap.set(name, colors[i]));
  variableColorMap.set(OTHER_GASES, LIGHT_GREY);

  const lineColor = CATEGORY_CONFIG[flagCategory].palette[0];

  const year = areaRuns[0]?.orderedPoints[0]?.year ?? 0;

  const values = new Map<string, number>();
  areaRuns.forEach((run) => {
    values.set(run.variableName, run.orderedPoints[0]?.value ?? 0);
  });

  const totalLineValue = lineRuns[0]?.orderedPoints[0]?.value ?? 0;

  // Compute waterfall segments
  interface Segment {
    name: string;
    value: number;
    start: number;
    end: number;
    color: string;
    isTotal: boolean;
  }

  const segments: Segment[] = [];
  let running = 0;

  areaVariableNames.forEach((varName) => {
    const value = values.get(varName) ?? 0;
    const start = running;
    const end = running + value;
    segments.push({
      name: varName,
      value,
      start,
      end,
      color: variableColorMap.get(varName) ?? colors[0],
      isTotal: false,
    });
    running = end;
  });

  // Total bar — standalone from 0 to totalLineValue
  segments.push({
    name: "Total Kyoto Gases",
    value: totalLineValue,
    start: 0,
    end: totalLineValue,
    color: lineColor,
    isTotal: true,
  });

  const allEnds = segments.map((s) => s.end);
  const allStarts = segments.map((s) => s.start);
  const yMin = Math.min(0, ...allStarts, ...allEnds);
  const yMax = Math.max(0, ...allStarts, ...allEnds);
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
    .attr("stroke-width", 1);

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

  // X axis — only label the Total bar
  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${dimensions.INNER_HEIGHT})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickFormat((name) =>
          name === "Total Kyoto Gases"
            ? `Total Kyoto Gases\n${year}\n${formatNumber(totalLineValue)}`
            : "",
        ),
    );

  xAxis.selectAll<SVGTextElement, string>(".tick text").each(function () {
    const el = d3.select(this);
    const fullText = el.text();
    if (!fullText) return;

    const lines = [`Total Kyoto Gases`, `${year}`, `${formatNumber(totalLineValue)} Mt CO2eq/yr`];
    el.text("");
    lines.forEach((line, i) => {
      el.append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? "1em" : "1.2em")
        .attr("text-anchor", "middle")
        .text(line);
    });
  });

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
    .text("Mt CO2eq/yr");

  // Draw bars
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
      .attr("opacity", 0.8)
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
              <strong>${seg.name}</strong>
            </div>
            <div>Value: ${formatNumber(seg.value)} Mt CO2eq/yr</div>
            ${!seg.isTotal ? `<div>Running total: ${formatNumber(seg.end)} Mt CO2eq/yr</div>` : ""}
            <div>Year: ${year}</div>
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
          .attr("opacity", 0.8)
          .attr("stroke", "none");

        tooltipManager?.hide();
      });

    // Connector line to next bar (not after total)
    if (!seg.isTotal && i < segments.length - 2) {
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
