import * as d3 from "d3";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import { FONT_SIZE } from "@/lib/config/plots/plots-constants";

interface CreateTooltipManagerProps {
  /** The D3 SVG selection that will be used to find the container element. */
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  /** The dimensions of the entire plot, including margins. */
  dimensions: PlotDimensions;
}

/**
 * Defines the controller object returned by the factory function.
 * This object exposes methods to interact with the tooltip.
 */
export interface TooltipManager {
  show: () => void;
  hide: () => void;
  /**
   * Sets the tooltip's content and positions it relative to a data point.
   * @param contentHTML The HTML string to render inside the tooltip.
   * @param pointX The x-coordinate of the data point within the inner plot area (g element).
   * @param pointY The y-coordinate of the data point within the inner plot area (g element).
   */
  update: (contentHTML: string, pointX: number, pointY: number) => void;
}

const TOOLTIP_CSS_CLASS = ".reusable-plot-tooltip";

/**
 * A factory function that creates and manages a tooltip element for a D3 plot.
 * It automatically finds the container element from the SVG's parent.
 *
 * @param {CreateTooltipManagerProps} props - The configuration object.
 * @returns {TooltipManager | null} An object with methods to control the tooltip, or null if container not found.
 */
export function createTooltipManager({
  svg,
  dimensions,
}: CreateTooltipManagerProps): TooltipManager | null {
  const containerElement = svg.node()?.parentElement;
  if (!containerElement) {
    console.warn("Could not find container element");
    return null;
  }
  const plotContainer = d3.select<HTMLElement, unknown>(containerElement);

  let tooltip = plotContainer.select<HTMLDivElement>(TOOLTIP_CSS_CLASS);
  if (tooltip.empty()) {
    tooltip = plotContainer
      .append("div")
      .attr("class", "reusable-plot-tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", FONT_SIZE)
      .style("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.12)")
      .style("pointer-events", "none")
      .style("z-index", "10")
      .style("opacity", "0")
      .style("white-space", "nowrap");
  }

  return {
    show(): void {
      tooltip.style("opacity", "1").style("transform", "translateY(0)");
    },
    hide(): void {
      tooltip.style("opacity", "0").style("transform", "translateY(-4px)");
    },
    update(contentHTML: string, pointX: number, pointY: number): void {
      tooltip.html(contentHTML);

      const tooltipNode = tooltip.node();
      if (!tooltipNode) return;

      const tooltipHeight = tooltipNode.offsetHeight;
      const toolTipWidth = tooltipNode.offsetWidth;
      const POINT_TOOLTIP_OFFSET = 16;

      const containerPointX = dimensions.MARGIN.LEFT + pointX;
      const containerPointY = dimensions.MARGIN.TOP + pointY;

      let Y_COORD = containerPointY - tooltipHeight / 2;

      if (Y_COORD < 0) {
        Y_COORD = POINT_TOOLTIP_OFFSET;
      }
      if (Y_COORD + tooltipHeight > dimensions.INNER_HEIGHT) {
        Y_COORD = dimensions.HEIGHT - 2 * tooltipHeight - POINT_TOOLTIP_OFFSET;
      }

      tooltip.style("top", `${Y_COORD}px`);

      if (containerPointX + POINT_TOOLTIP_OFFSET + toolTipWidth > dimensions.WIDTH) {
        const rightPosition = dimensions.WIDTH - containerPointX + POINT_TOOLTIP_OFFSET;
        tooltip.style("left", null).style("right", `${rightPosition}px`);
      } else {
        const leftPosition = containerPointX + POINT_TOOLTIP_OFFSET;
        tooltip.style("right", null).style("left", `${leftPosition}px`);
      }
    },
  };
}
