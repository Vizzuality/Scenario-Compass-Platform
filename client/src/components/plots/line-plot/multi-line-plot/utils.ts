import { GREY, FONT_SIZE, GRID_STROKE_COLOR } from "@/components/plots/utils/constants";
import { ExtendedRun } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/dimensions";
import { CATEGORY_CONFIG } from "@/containers/scenario-dashboard/utils/category-config";
import * as d3 from "d3";
import {
  SVGSelection,
  calculateDomain,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
  createLineGenerator,
  filterVisibleRuns,
  getRunColor,
} from "@/components/plots/utils";

const PLOT_CONFIG = {
  NORMAL_STROKE_WIDTH: 2.5,
  HOVER_HIGHLIGHT_WIDTH: 3,
  NORMAL_OPACITY: 0.7,
  DIMMED_OPACITY: 0.2,
  FULL_OPACITY: 1,
  FAST_TRANSITION_MS: 100,
  NORMAL_TRANSITION_MS: 150,
};

const LINE_CLASS_PREFIX = "line-run-";
const HOVER_GROUP_CLASS = "hover-group";

export const renderMultiLinePlot = (
  svg: SVGSelection,
  runs: ExtendedRun[],
  selectedFlags: string[] = [],
  hiddenFlags: string[] = [],
  onRunClick?: (run: ExtendedRun) => void,
): void => {
  clearSVG(svg);
  const visibleRuns = filterVisibleRuns(runs, hiddenFlags);
  if (visibleRuns.length === 0) return;

  const dimensions = getPlotDimensions();
  const g = createMainGroup(svg, dimensions);
  const points = visibleRuns.flatMap((run) => run.points);
  const hasSelection = selectedFlags.length > 0;
  const domain = calculateDomain(points);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);
  const lineGenerator = createLineGenerator(scales);

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes(g, scales, dimensions.INNER_HEIGHT);

  let currentHoveredRun: number | null = null;

  visibleRuns.forEach((run, index) => {
    if (!run.points || run.points.length === 0) return;

    const sortedPoints = [...run.points].sort((a, b) => a.year - b.year);
    const color = getRunColor(run, selectedFlags, hasSelection);

    g.append("path")
      .datum(sortedPoints)
      .attr("class", `${LINE_CLASS_PREFIX}${index}`)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH)
      .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
      .attr("d", lineGenerator)
      .style("cursor", "pointer")
      .style("pointer-events", "stroke");
  });

  const hoverGroup = g.append("g").attr("class", HOVER_GROUP_CLASS);

  const tooltip = hoverGroup
    .append("g")
    .attr("class", "svg-tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  const tooltipRect = tooltip
    .append("rect")
    .attr("fill", "white")
    .attr("fill-opacity", 1)
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

  const tooltipText = tooltip
    .append("text")
    .attr("text-anchor", "start")
    .style("font-size", FONT_SIZE)
    .style("fill", GREY)
    .style("fill-opacity", 1);

  visibleRuns.forEach((run, index) => {
    g.select(`.${LINE_CLASS_PREFIX}${index}`)
      .on("mouseenter", (event) => {
        if (currentHoveredRun === index) return;
        currentHoveredRun = index;

        g.selectAll(`path[class*='${LINE_CLASS_PREFIX}']`)
          .transition()
          .duration(PLOT_CONFIG.FAST_TRANSITION_MS)
          .attr("stroke-opacity", PLOT_CONFIG.DIMMED_OPACITY)
          .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH);

        const hoverColor = CATEGORY_CONFIG[run.flagCategory]?.color || GREY;

        g.select(`.${LINE_CLASS_PREFIX}${index}`)
          .transition()
          .duration(PLOT_CONFIG.FAST_TRANSITION_MS)
          .attr("stroke", hoverColor)
          .attr("stroke-opacity", PLOT_CONFIG.FULL_OPACITY)
          .attr("stroke-width", PLOT_CONFIG.HOVER_HIGHLIGHT_WIDTH);

        tooltipText.selectAll("tspan").remove();

        const tooltipLines = [`Model: ${run.model.name}`, `Scenario: ${run.scenario.name}`];

        tooltipLines.forEach((line, i) => {
          tooltipText
            .append("tspan")
            .attr("x", 8)
            .attr("y", 24 + i * 16)
            .attr("fill", GREY)
            .attr("fill-opacity", 1)
            .attr("font-size", FONT_SIZE)
            .attr("font-weight", "bold")
            .text(line);
        });

        // Does the max between text width and 200px, line.length * approx char width (8px)
        const tooltipWidth = Math.max(
          200,
          Math.max(...tooltipLines.map((line) => line.length * 8)),
        );
        const tooltipHeight = 24 + tooltipLines.length * 16 + 8;

        const [mouseX, mouseY] = d3.pointer(event, g.node());
        let tooltipX = mouseX + 10;
        let tooltipY = mouseY - tooltipHeight / 2;

        if (tooltipX + tooltipWidth > dimensions.INNER_WIDTH) {
          tooltipX = mouseX - tooltipWidth - 10;
        }
        if (tooltipY < 0) {
          tooltipY = 10;
        }
        if (tooltipY + tooltipHeight > dimensions.INNER_HEIGHT) {
          tooltipY = dimensions.INNER_HEIGHT - tooltipHeight - 10;
        }

        tooltip.attr("transform", `translate(${tooltipX}, ${tooltipY})`).style("opacity", 1);

        tooltipRect.attr("width", tooltipWidth).attr("height", tooltipHeight);
      })
      .on("mouseleave", () => {
        currentHoveredRun = null;

        visibleRuns.forEach((r, i) => {
          const originalColor = getRunColor(r, selectedFlags, hasSelection);

          g.select(`.${LINE_CLASS_PREFIX}${i}`)
            .transition()
            .duration(PLOT_CONFIG.NORMAL_TRANSITION_MS)
            .attr("stroke", originalColor)
            .attr("stroke-opacity", PLOT_CONFIG.NORMAL_OPACITY)
            .attr("stroke-width", PLOT_CONFIG.NORMAL_STROKE_WIDTH);
        });

        tooltip.style("opacity", 0);
      })
      .on("click", (event) => {
        event.stopPropagation();
        onRunClick?.(run);
      });
  });
};
