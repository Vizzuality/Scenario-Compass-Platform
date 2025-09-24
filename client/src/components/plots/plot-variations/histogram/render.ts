import * as d3 from "d3";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import { AREA_BACKGROUND_COLOR, GREY } from "@/components/plots/utils/constants";
import {
  SVGSelection,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
} from "@/components/plots/utils";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

interface Props {
  svg: SVGSelection;
  metaIndicators: MetaIndicator[];
  dimensions: PlotDimensions;
}

const getMetaIndicatorValues = (metaIndicators: MetaIndicator[]): number[] => {
  return metaIndicators
    .map((mi) => parseFloat(mi.value))
    .filter((value) => !isNaN(value) && isFinite(value));
};

export const renderHistogramPlot = ({ svg, metaIndicators, dimensions }: Props): void => {
  clearSVG(svg);
  const BIN_COUNT = 7;

  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager || metaIndicators.length === 0) return;

  const values = getMetaIndicatorValues(metaIndicators);
  if (values.length === 0) {
    const g = createMainGroup(svg, dimensions);
    g.append("text")
      .attr("x", dimensions.INNER_WIDTH / 2)
      .attr("y", dimensions.INNER_HEIGHT / 2)
      .attr("text-anchor", "middle")
      .attr("fill", GREY)
      .text("No valid numeric data available");
    return;
  }

  const xDomain = d3.extent(values) as [number, number];

  const binWidth = (xDomain[1] - xDomain[0]) / BIN_COUNT;
  const thresholds = d3.range(BIN_COUNT + 1).map((i) => xDomain[0] + i * binWidth);

  let bins = d3.bin<number, number>().domain(xDomain).thresholds(thresholds)(values);

  if (bins.length > BIN_COUNT) {
    const lastBin = bins[BIN_COUNT - 1];
    for (let i = BIN_COUNT; i < bins.length; i++) {
      lastBin.push(...bins[i]);
    }
    lastBin.x1 = bins[bins.length - 1].x1;

    bins = bins.slice(0, BIN_COUNT);
  }

  const range = xDomain[1] - xDomain[0];
  const visualPadding = range * 0.05;
  const paddedXDomain: [number, number] = [xDomain[0] - visualPadding, xDomain[1] + visualPadding];

  const yDomain: [number, number] = [0, d3.max(bins, (d) => d.length) || 0];
  const { INNER_WIDTH, INNER_HEIGHT } = dimensions;

  const g = createMainGroup(svg, dimensions);
  const scales = createScales({ xDomain: paddedXDomain, yDomain }, INNER_WIDTH, INNER_HEIGHT);
  const formatNumber = d3.format(".2~f");

  renderGridLines(g, scales.yScale, INNER_WIDTH);
  renderAxes({
    groupSelection: g,
    scales,
    height: INNER_HEIGHT,
    width: INNER_WIDTH,
    unit: "Count",
    xTickValues: thresholds,
  });

  g.select(".x-axis")
    .selectAll(".tick text")
    .text((d, i) => formatNumber(thresholds[i]));

  g.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", (d) => scales.xScale(d.x0!))
    .attr("y", (d) => scales.yScale(d.length))
    .attr("width", (d) => Math.max(0, scales.xScale(d.x1!) - scales.xScale(d.x0!) - 1))
    .attr("height", (d) => INNER_HEIGHT - scales.yScale(d.length))
    .attr("fill", AREA_BACKGROUND_COLOR)
    .attr("stroke", GREY)
    .on("mouseenter", function (_event, d) {
      d3.select(this).attr("fill", GREY);

      tooltipManager.show();
      tooltipManager.update(
        `<div class="text-black">
          <div><strong>Range:</strong> ${formatNumber(d.x0!)} - ${formatNumber(d.x1!)}</div>
          <div><strong>Count:</strong> ${d.length}</div>
        </div>`,
        scales.xScale((d.x0! + d.x1!) / 2),
        scales.yScale(d.length) - 10,
      );
    })
    .on("mouseleave", function () {
      d3.select(this).attr("fill", AREA_BACKGROUND_COLOR);
      tooltipManager.hide();
    });
};
