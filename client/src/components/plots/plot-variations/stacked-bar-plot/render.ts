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
const BAR_WIDTH_RATIO = 0.4;
const PADDING = 0.1;

export const renderStackedBarPlot = ({ svg, runs, dimensions, variablesMap }: Props): void => {
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

  const positiveSum = presentVariables.reduce((sum, v) => sum + Math.max(0, values[v]), 0);
  const negativeSum = presentVariables.reduce((sum, v) => sum + Math.min(0, values[v]), 0);
  const padding = (positiveSum - negativeSum) * PADDING;

  const barWidth = dimensions.INNER_WIDTH * BAR_WIDTH_RATIO;
  const barX = (dimensions.INNER_WIDTH - barWidth) / 2;

  const yScale = d3
    .scaleLinear()
    .domain([negativeSum - padding, positiveSum + padding])
    .range([dimensions.INNER_HEIGHT, 0]);

  const xScale = d3
    .scaleLinear()
    .domain([year - 1, year + 1])
    .range([0, dimensions.INNER_WIDTH]);

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

  // Zero baseline — drawn after axes so it sits on top of grid lines
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

  // X axis — always at bottom
  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${dimensions.INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).tickValues([year]).tickFormat(d3.format("d")));

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

  // Stacked bar segments — positives stack up from 0, negatives stack down from 0
  let positiveCumulative = 0;
  let negativeCumulative = 0;

  presentVariables.forEach((varName) => {
    const value = values[varName];
    if (!value) return;

    const isPositive = value > 0;
    const color = variableColorMap.get(varName) ?? colors[0];
    const darkerColor = d3.color(color)?.darker(0.8).toString() ?? color;
    const matchingRun = runs.find((r) => r.variableName === varName);

    let y0: number;
    let y1: number;

    if (isPositive) {
      y0 = yScale(positiveCumulative);
      y1 = yScale(positiveCumulative + value);
      positiveCumulative += value;
    } else {
      y0 = yScale(negativeCumulative + value);
      y1 = yScale(negativeCumulative);
      negativeCumulative += value;
    }

    const height = Math.abs(y0 - y1);
    const rectY = Math.min(y0, y1);

    g.append("rect")
      .attr("x", barX)
      .attr("y", rectY)
      .attr("width", barWidth)
      .attr("height", height)
      .attr("fill", color)
      .attr("opacity", 0.85)
      .attr("stroke", "none")
      .style("cursor", "pointer")
      .on("mouseenter", function () {
        d3.select(this)
          .attr("x", barX + STROKE_WIDTH / 2)
          .attr("y", rectY + STROKE_WIDTH / 2)
          .attr("width", barWidth - STROKE_WIDTH)
          .attr("height", height - STROKE_WIDTH)
          .attr("opacity", 1)
          .attr("stroke", darkerColor)
          .attr("stroke-width", STROKE_WIDTH);

        tooltipManager?.show();
        tooltipManager?.update(
          `<div class="text-black flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div style="width:10px;height:10px;background:${color};border-radius:100px;border:1px solid #666;flex-shrink:0"></div>
              <strong>${variablesMap[varName] ?? varName}</strong>
            </div>
            <div>Value: ${formatNumber(value)} ${matchingRun?.unit ?? ""}</div>
          </div>`,
          barX + barWidth / 2,
          rectY + height / 2,
        );
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("x", barX)
          .attr("y", rectY)
          .attr("width", barWidth)
          .attr("height", height)
          .attr("opacity", 0.85)
          .attr("stroke", "none");

        tooltipManager?.hide();
      });
  });
};
