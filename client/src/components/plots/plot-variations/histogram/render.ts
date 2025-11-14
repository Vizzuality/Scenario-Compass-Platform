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
  xUnitText: string;
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

export const renderHistogramPlot = ({
  svg,
  metaIndicators,
  dimensions,
  split,
  xUnitText,
}: Props): void => {
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
  const maxX = thresholds[thresholds.length - 1];
  const minX = thresholds[0];

  const range = maxX - minX;
  const visualPadding = range * 0.05;
  const paddedXDomain: [number, number] = [minX - visualPadding, maxX + visualPadding];

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
    yUnitText: "Count",
    xTickValues: thresholds,
    xUnitText: xUnitText,
  });

  g.select(".x-axis")
    .selectAll(".tick text")
    .text((d, i) => formatNumber(thresholds[i]));

  /**
   * Draw bars without stroke
   * The borders will be drawn bellow.
   */
  g.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", (d) => scales.xScale(d.x0!))
    .attr("y", (d) => scales.yScale(d.length))
    .attr("width", (d) => Math.max(0, scales.xScale(d.x1!) - scales.xScale(d.x0!)))
    .attr("height", (d) => INNER_HEIGHT - scales.yScale(d.length))
    .attr("fill", AREA_BACKGROUND_COLOR)
    .attr("stroke", "none")
    .on("mouseenter", function (_event, d) {
      d3.select(this).attr("fill", GREY);
      tooltipManager.show();
      tooltipManager.update(
        `<div class="text-black">
            <div><strong>Range:</strong> ${formatNumber(d.x0!)} - ${formatNumber(d.x1! - 1)}</div>
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

  /**
   * Draw complete histogram outline
   * Creates a continuous path that traces the outer perimeter of all bins
   * -> Draws just the border of the "outsides"
   */
  if (bins.length > 0) {
    const firstBin = bins[0];
    const lastBin = bins[bins.length - 1];

    // Initialize a D3 path generator for creating the outline
    const outlinePath = d3.path();

    // Start in the BOTTOM_LEFT corner of the first bin
    outlinePath.moveTo(scales.xScale(firstBin.x0!), INNER_HEIGHT);

    /**
     * Trace the top edge of the histogram by drawing up and across each bin
     * For each bin -> draw vertical line up to the bin height, then horizontal line across the bin width
     */
    bins.forEach((bin) => {
      // Left edge of bin
      const x0 = scales.xScale(bin.x0!);
      // Right edge of bin
      const x1 = scales.xScale(bin.x1!);
      // Height of bin
      const y = scales.yScale(bin.length);

      // Draw vertical line up to the bin's height
      outlinePath.lineTo(x0, y);
      // Draw horizontal line across the top of the bin
      outlinePath.lineTo(x1, y);
    });

    // Complete the outline by drawing down the right side and closing the path
    outlinePath.lineTo(scales.xScale(lastBin.x1!), INNER_HEIGHT);
    outlinePath.closePath();

    g.append("path")
      .attr("d", outlinePath.toString())
      .attr("fill", "none")
      .attr("stroke", GREY)
      .attr("stroke-width", 1);
  }

  /**
   * Draw vertical separator lines between adjacent bins
   * These lines visually distinguish where one bin ends and the next begins
   */
  bins.forEach((bin, i) => {
    // Skip the last bin since there's no bin after it to separate from
    if (i < bins.length - 1) {
      // Position the separator at the boundary between this bin and the next
      const x = scales.xScale(bin.x1!);
      const nextBin = bins[i + 1];

      // Calculate the heights of the current and next bins
      const y1 = scales.yScale(bin.length);
      const y2 = scales.yScale(nextBin.length);

      // Draw the separator up to the taller of the two adjacent bins
      // This ensures the separator reaches the histogram outline
      const maxY = Math.max(y1, y2);

      // Render a vertical line from the baseline to the maximum height
      g.append("line")
        .attr("x1", x)
        .attr("y1", INNER_HEIGHT) // Bottom of chart (baseline)
        .attr("x2", x)
        .attr("y2", maxY) // Top of the taller adjacent bin
        .attr("stroke", GREY)
        .attr("stroke-width", 1);
    }
  });
};
