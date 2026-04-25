import {
  DOT_HOVER_RADIUS,
  DOT_HOVER_STROKE,
  GREY,
  PLOT_CONFIG,
} from "@/lib/config/plots/plots-constants";
import { PlotDimensions } from "@/lib/config/plots/plots-dimensions";
import * as d3 from "d3";
import {
  SVGSelection,
  calculateDomain,
  createScales,
  createMainGroup,
  clearSVG,
  renderGridLines,
  renderAxes,
} from "@/utils/plots/render-functions";
import {
  CATEGORY_CONFIG,
  getCategoryAbbrev,
} from "@/lib/config/reasons-of-concern/category-config";
import { ExtendedRun } from "@/types/data/run";
import { getRunColor } from "@/utils/plots/colors-functions";
import { createTooltipHelpers } from "@/components/plots/plot-variations/canvas/tooltip";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";

const DOT_CLASS_PREFIX = "dot-run-";
const DOT_TOOLTIP_CLASS = "dot-plot-tooltip";

interface Props {
  svg: SVGSelection;
  runs: ExtendedRun[];
  dimensions: PlotDimensions;
  selectedFlags: string[];
  onRunClick: (run: ExtendedRun) => void;
  onPrefetch?: (run: ExtendedRun) => void;
  selectedRun?: ExtendedRun | null;
  onSelectedRunChange?: (run: ExtendedRun | null) => void;
  yExtent?: YExtentPair;
}

export const renderDotPlot = ({
  svg,
  runs,
  selectedFlags,
  dimensions,
  onRunClick,
  onPrefetch,
  selectedRun,
  onSelectedRunChange,
  yExtent,
}: Props): void => {
  clearSVG(svg);

  const containerEl = svg.node()?.parentElement as HTMLDivElement | null;
  if (!containerEl || runs.length === 0) return;

  containerEl.style.position = "relative";

  const existingTooltip = containerEl.querySelector<HTMLDivElement>(`.${DOT_TOOLTIP_CLASS}`);
  if (existingTooltip) existingTooltip.remove();
  const tooltipEl = document.createElement("div");
  tooltipEl.className = DOT_TOOLTIP_CLASS;
  containerEl.appendChild(tooltipEl);

  const tooltip = createTooltipHelpers(tooltipEl, onRunClick, onPrefetch, () => {
    tooltip.setInteractive(false);
    onSelectedRunChange?.(null);
    resetDots();
  });

  const g = createMainGroup(svg, dimensions);

  const allPoints = runs.flatMap((run) =>
    run.orderedPoints.map((point) => ({
      ...point,
      run,
    })),
  );

  const hasSelection = selectedFlags.length > 0;
  const domain = calculateDomain(allPoints, yExtent);
  const scales = createScales(domain, dimensions.INNER_WIDTH, dimensions.INNER_HEIGHT);

  const isRunSelected = (run: ExtendedRun) =>
    !hasSelection || selectedFlags.includes(getCategoryAbbrev(run.flagCategory) ?? "");

  renderGridLines(g, scales.yScale, dimensions.INNER_WIDTH);
  renderAxes({
    groupSelection: g,
    scales,
    height: dimensions.INNER_HEIGHT,
    yUnitText: runs[0].unit,
  });

  const JITTER_AMOUNT = dimensions.INNER_WIDTH * 0.8;

  const getJitter = (runId: string, year: number) => {
    const seed =
      runId.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0) + year;
    const pseudo = Math.sin(seed) * 10000;
    return (pseudo - Math.floor(pseudo) - 0.5) * JITTER_AMOUNT;
  };

  const getDotX = (d: (typeof allPoints)[number]) =>
    scales.xScale(d.year) + getJitter(d.run.runId, d.year);

  const getAbsCoords = (d: (typeof allPoints)[number]) => ({
    absX: dimensions.MARGIN.LEFT + getDotX(d),
    absY: dimensions.MARGIN.TOP + scales.yScale(d.value),
  });

  const dots = g
    .selectAll(".data-point")
    .data(allPoints)
    .join("circle")
    .attr("class", (d) => `${DOT_CLASS_PREFIX}${d.run.runId}`)
    .attr("cx", (d) => getDotX(d))
    .attr("cy", (d) => scales.yScale(d.value))
    .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS)
    .attr("fill", (d) => getRunColor(d.run, selectedFlags, hasSelection))
    .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
    .style("cursor", (d) => (isRunSelected(d.run) ? "pointer" : "default"));

  dots.filter((d) => isRunSelected(d.run)).raise();

  const resetDots = () => {
    dots
      .transition()
      .duration(0)
      .attr("fill-opacity", PLOT_CONFIG.NORMAL_OPACITY)
      .attr("stroke", "none")
      .attr("r", PLOT_CONFIG.SINGLE_DOT_RADIUS)
      .attr("fill", (d) => getRunColor(d.run, selectedFlags, hasSelection));
  };

  const selectDot = (run: ExtendedRun, point: { year: number; value: number }) => {
    if (!isRunSelected(run)) return;

    const hoverColor = CATEGORY_CONFIG[run.flagCategory]?.color || GREY;

    dots.transition().duration(0).attr("fill-opacity", PLOT_CONFIG.DIMMED_OPACITY);

    dots
      .filter((d) => d.run.runId === run.runId)
      .transition()
      .duration(0)
      .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
      .attr("fill", hoverColor)
      .attr("stroke-width", DOT_HOVER_STROKE)
      .attr("r", DOT_HOVER_RADIUS);

    tooltip.setInteractive(true);
    tooltip.updateContent(run, point);

    const matchedPoint = allPoints.find((p) => p.run.runId === run.runId && p.year === point.year);
    if (matchedPoint) {
      const { absX, absY } = getAbsCoords(matchedPoint);
      tooltip.position(absX, absY, containerEl!.offsetWidth, containerEl!.offsetHeight);
    }
  };

  // Sync external selectedRun on render
  if (selectedRun) {
    const selectedPoint = allPoints.find((p) => p.run.runId === selectedRun.runId);
    if (selectedPoint) {
      selectDot(selectedRun, { year: selectedPoint.year, value: selectedPoint.value });
    }
  }

  dots
    .on("mouseleave", function (_event, d) {
      if (!isRunSelected(d.run)) return;
      if (tooltipEl!.style.pointerEvents === "auto") return;
      tooltip.hide();
      resetDots();
    })
    .on("mouseenter", function (_event, d) {
      if (!isRunSelected(d.run)) return;
      if (tooltipEl!.style.pointerEvents === "auto") return;

      const hoveredDot = d3.select(this);
      const hoverColor = CATEGORY_CONFIG[d.run.flagCategory]?.color || GREY;

      dots.transition().duration(0).attr("fill-opacity", PLOT_CONFIG.DIMMED_OPACITY);

      hoveredDot
        .transition()
        .duration(0)
        .attr("fill-opacity", PLOT_CONFIG.FULL_OPACITY)
        .attr("fill", hoverColor)
        .attr("stroke-width", DOT_HOVER_STROKE)
        .attr("r", DOT_HOVER_RADIUS);

      tooltip.updateContent(d.run, { year: d.year, value: d.value });
      const { absX, absY } = getAbsCoords(d);
      tooltip.position(absX, absY, containerEl!.offsetWidth, containerEl!.offsetHeight);
    })
    .on("click", function (event, d) {
      if (!isRunSelected(d.run)) return;
      event.stopPropagation();
      onSelectedRunChange?.(d.run);
      selectDot(d.run, { year: d.year, value: d.value });
    });

  svg.on("click.tooltip-reset", () => {
    tooltip.setInteractive(false);
    tooltip.hide();
    onSelectedRunChange?.(null);
    resetDots();
  });
};
