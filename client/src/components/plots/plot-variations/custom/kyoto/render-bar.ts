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

const TOTAL_LABEL_PADDING = 10;
const STROKE_WIDTH = 1;

export const renderKyotoBarPlot = ({ svg, data, dimensions }: Props): void => {
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

  const positiveSum = areaVariableNames.reduce(
    (sum, name) => sum + Math.max(0, values.get(name) ?? 0),
    0,
  );
  const negativeSum = areaVariableNames.reduce(
    (sum, name) => sum + Math.min(0, values.get(name) ?? 0),
    0,
  );

  const yMax = Math.max(positiveSum, totalLineValue);
  const yMin = Math.min(negativeSum, 0);
  const yPadding = (yMax - yMin) * 0.2;

  const yScale = d3
    .scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([dimensions.INNER_HEIGHT, 0]);

  const BAR_WIDTH_RATIO = 0.4;
  const barWidth = dimensions.INNER_WIDTH * BAR_WIDTH_RATIO;
  const barX = (dimensions.INNER_WIDTH - barWidth) / 2;

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

  // X axis
  const xScale = d3
    .scaleLinear()
    .domain([year - 1, year + 1])
    .range([0, dimensions.INNER_WIDTH]);

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
    .text("Mt CO2eq/yr");

  // Zero baseline
  const zeroY = yScale(0);
  g.append("line")
    .attr("x1", 0)
    .attr("x2", dimensions.INNER_WIDTH)
    .attr("y1", zeroY)
    .attr("y2", zeroY)
    .attr("stroke", GRID_TEXT_COLOR)
    .attr("stroke-width", 1);

  // Stacked bar segments — positives up from 0, negatives down from 0
  let positiveCumulative = 0;
  let negativeCumulative = 0;

  areaVariableNames.forEach((varName) => {
    const value = values.get(varName) ?? 0;
    if (!value) return;

    const isPositive = value > 0;
    const color = variableColorMap.get(varName) ?? colors[0];
    const darkerColor = d3.color(color)?.darker(0.8).toString() ?? color;

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
      .attr("opacity", 0.8)
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
              <strong>${varName}</strong>
            </div>
            <div>Value: ${formatNumber(value)} Mt CO2eq/yr</div>
            <div>Year: ${year}</div>
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
          .attr("opacity", 0.8)
          .attr("stroke", "none");

        tooltipManager?.hide();
      });
  });

  // Total marker line — drawn last so it sits on top
  const totalY = yScale(totalLineValue);

  g.append("line")
    .attr("x1", barX - 8)
    .attr("x2", barX + barWidth + 8)
    .attr("y1", totalY)
    .attr("y2", totalY)
    .attr("stroke", lineColor)
    .attr("stroke-width", 2);

  g.append("text")
    .attr("x", barX + barWidth / 2)
    .attr("y", totalY - TOTAL_LABEL_PADDING)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "auto")
    .style("font-size", FONT_SIZE)
    .style("font-weight", "600")
    .style("fill", lineColor)
    .text(`Total: ${formatNumber(totalLineValue)} Mt CO2eq/yr`);
};
