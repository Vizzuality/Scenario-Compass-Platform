import * as d3 from "d3";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { AREA_BACKGROUND_COLOR, GREY } from "@/lib/config/plots/plots-constants";
import {
  SVGSelection,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
} from "@/utils/plots/render-functions";
import { createTooltipManager } from "@/utils/plots/tooltip-manager";
import { MetaIndicator } from "@/types/data/meta-indicator";
import {
  BinningResult,
  createDecadeBins,
  createDefaultBins,
} from "@/components/plots/plot-variations/histogram/histogram-bining-functions";

export type HistogramDataSplit = "decade" | "default";

interface Props {
  svg: SVGSelection;
  metaIndicators: MetaIndicator[];
  dimensions: PlotDimensions;
  split: HistogramDataSplit;
}

/**
 * Returns the values of the meta-indicators:
 * e.g. [1.851322625141053, 1.899893027998228, 1.937624684262318, 1.986659982700594]
 *
 * @param metaIndicators
 */
const getMetaIndicatorValues = (metaIndicators: MetaIndicator[]): number[] => {
  return metaIndicators
    .map((mi) => parseFloat(mi.value))
    .filter((value) => !isNaN(value) && isFinite(value));
};

export const renderHistogramPlot = ({ svg, metaIndicators, dimensions, split }: Props): void => {
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

  let binningResult: BinningResult;

  if (split === "decade") {
    binningResult = createDecadeBins(values, xDomain);
  } else if (split === "default") {
    binningResult = createDefaultBins(values, xDomain, BIN_COUNT);
  } else {
    console.error(`Unknown histogram split type: ${split}`);
    return;
  }

  const { bins, thresholds } = binningResult;

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
