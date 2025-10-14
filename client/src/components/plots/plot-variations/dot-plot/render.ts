import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  GREY,
  PLOT_CONFIG,
} from "@/components/plots/utils/constants";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import * as d3 from "d3";
import {
  SVGSelection,
  calculateDomain,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
  filterVisibleRuns,
  getRunColor,
  formatNumber,
} from "@/components/plots/utils";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";
import { createTooltipManager } from "@/components/plots/utils/tooltip-manager";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";

const DOT_CLASS_PREFIX = "dot-run-";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  selectedFlags: string[];
  hiddenFlags: string[];
  showVetting: boolean;
  onRunClick?: (run: ExtendedRun) => void;
}

export const renderDotPlot = ({
  svg,
  runs,
  selectedFlags,
  dimensions,
  hiddenFlags,
  onRunClick,
  showVetting,
}: Props): void => {
  clearSVG(svg);
  const tooltipManager = createTooltipManager({ svg, dimensions });
  if (!tooltipManager) return;
  const visibleRuns = filterVisibleRuns(runs, hiddenFlags, showVetting);
  if (visibleRuns.length === 0) return;

  const g = createMainGroup(svg, dimensions);

  const allPoints = visibleRuns.flatMap((run) =>
    run.orderedPoints.map((point) => ({
      ...point,
      run,
    })),
  );

  const hasSelection = selectedFlags.length > 0;
  const domain = calculateDomain(allPoints);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes({ groupSelection: g, scales, height: dimensions.INNER_HEIGHT, unit: runs[0].unit });

  const JITTER_AMOUNT = 250;

  const getJitter = (runId: string, year: number) => {
    const seed =
      runId.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0) + year;

    const pseudo = Math.sin(seed) * 10000;
    return (pseudo - Math.floor(pseudo) - 0.5) * JITTER_AMOUNT;
  };

  const dots = g
    .selectAll(".data-point")
    .data(allPoints)
    .join("circle")
    .attr("class", (d) => `${DOT_CLASS_PREFIX}${d.run.runId}`)
    .attr("cx", (d) => {
      const baseX = scales.xScale(d.year);
      const jitter = getJitter(d.run.runId, d.year);
      return baseX + jitter;
    })
    .attr("cy", (d) => scales.yScale(d.value))
    .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS)
    .attr("fill", (d) => getRunColor(d.run, selectedFlags, hasSelection))
    .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .style("cursor", "pointer");

  dots
    .on("mouseleave", function () {
      dots
        .transition()
        .duration(PLOT_CONFIG.NORMAL_TRANSITION_MS)
        .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
        .attr("stroke", "none")
        .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS)
        .attr("fill", (d) => getRunColor(d.run, selectedFlags, hasSelection));

      tooltipManager.hide();
    })
    .on("mouseenter", function (event, hoveredRun) {
      const hoveredDot = d3.select(this);
      const hoverColor = CATEGORY_CONFIG[hoveredRun.run.flagCategory]?.color || GREY;

      dots
        .transition()
        .duration(PLOT_CONFIG.FAST_TRANSITION_MS)
        .attr("fill-opacity", PLOT_CONFIG.DIMMED_OPACITY);

      hoveredDot
        .transition()
        .duration(PLOT_CONFIG.FAST_TRANSITION_MS)
        .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
        .attr("fill", hoverColor)
        .attr("stroke-width", DOT_HOVER_STROKE)
        .attr("r", DOT_HOVER_RADIUS);
      tooltipManager.show();

      const tooltipHTML = `
        <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
            <li>
                <strong> Year: </strong> ${hoveredRun.year}
            </li>
            <li>
                <strong>Value: </strong>
                <span >${formatNumber(hoveredRun.value)}</span>
            </li>
            <li>
                <strong> Model: </strong>
                <span>${hoveredRun.run.modelName}</span>
            </li>
            <li>
                <strong> Scenario: </strong>
                <span>${hoveredRun.run.scenarioName}</li>
            </ul>
      `;

      const pointX = scales.xScale(hoveredRun.year);
      const pointY = scales.yScale(hoveredRun.value);

      tooltipManager.update(tooltipHTML, pointX, pointY);
    })

    .on("click", (event, d) => {
      event.stopPropagation();
      onRunClick?.(d.run);
    });
};
