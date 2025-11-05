import * as d3 from "d3";
import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  DOT_RADIUS,
  DOT_STROKE_WIDTH,
  GREY,
  STONE,
} from "@/lib/config/plots/plots-constants";

type GroupSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export const createHoverElements = (
  parent: GroupSelection,
  innerHeight: number,
  color?: string,
): {
  hoverGroup: GroupSelection;
  verticalHoverLine: d3.Selection<SVGLineElement, unknown, null, undefined>;
  intersectionPoint: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  pointWrappingCircle: d3.Selection<SVGCircleElement, unknown, null, undefined>;
} => {
  const computedColor = color || GREY;
  const hoverGroup = parent.append("g").attr("class", "hover-group");

  const verticalHoverLine = hoverGroup
    .append("line")
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", STONE)
    .attr("stroke-width", 1)
    .style("opacity", 0);

  const intersectionPoint = hoverGroup
    .append("circle")
    .attr("r", DOT_RADIUS)
    .attr("fill", computedColor)
    .attr("stroke", "white")
    .attr("stroke-width", DOT_STROKE_WIDTH)
    .style("opacity", 0);

  const pointWrappingCircle = hoverGroup
    .append("circle")
    .attr("r", DOT_HOVER_RADIUS)
    .attr("fill", "none")
    .attr("stroke", computedColor)
    .attr("stroke-width", DOT_HOVER_STROKE)
    .attr("stroke-opacity", 0.3)
    .style("opacity", 0);

  return {
    hoverGroup,
    verticalHoverLine,
    intersectionPoint,
    pointWrappingCircle,
  };
};
