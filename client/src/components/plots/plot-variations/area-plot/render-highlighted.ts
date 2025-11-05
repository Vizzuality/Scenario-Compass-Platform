import { getCategoryAbbrev } from "@/lib/config/reasons-of-concern/category-config";
import { GroupSelection, PlotScales, processAreaChartData } from "@/utils/plots/render-functions";
import * as d3 from "d3";
import { AggregatedDataPoint } from "@/types/data/data-point";
import { ExtendedRun } from "@/types/data/run";
import { STROKE_WIDTH } from "@/lib/config/plots/plots-constants";
import { getRunColor } from "@/utils/plots/colors-functions";

interface Params {
  visibleRuns: ExtendedRun[];
  selectedFlags: string[];
  scales: PlotScales;
  groupSelection: GroupSelection;
}

export const renderHighlightedFlags = ({
  groupSelection,
  visibleRuns,
  selectedFlags,
  scales,
}: Params) => {
  const hasSelection = selectedFlags.length > 0;

  const selectedRunsByFlag = new Map<string, ExtendedRun[]>();

  visibleRuns.forEach((run) => {
    const abbrev = getCategoryAbbrev(run.flagCategory);
    if (abbrev && selectedFlags.includes(abbrev)) {
      if (!selectedRunsByFlag.has(abbrev)) {
        selectedRunsByFlag.set(abbrev, []);
      }
      selectedRunsByFlag.get(abbrev)!.push(run);
    }
  });

  selectedRunsByFlag.forEach((runs, flagAbbrev) => {
    if (runs.length === 0) return;

    const flagPoints = runs.flatMap((run) => run.orderedPoints);
    const { aggregatedData: flagAggregatedData } = processAreaChartData(flagPoints);

    const firstRunInFlag = runs[0];
    const flagColor = getRunColor(firstRunInFlag, selectedFlags, hasSelection);

    const flagAreaSurface = d3
      .area<AggregatedDataPoint>()
      .x((d) => scales.xScale(d.year))
      .y0((d) => scales.yScale(d.min))
      .y1((d) => scales.yScale(d.max))
      .curve(d3.curveMonotoneX);

    const flagMedianLine = d3
      .line<AggregatedDataPoint>()
      .x((d) => scales.xScale(d.year))
      .y((d) => scales.yScale(d.median))
      .curve(d3.curveMonotoneX);

    groupSelection
      .append("path")
      .datum(flagAggregatedData)
      .attr("fill", flagColor)
      .attr("fill-opacity", 0.2)
      .attr("d", flagAreaSurface)
      .attr("class", `flag-area-${flagAbbrev}`);

    groupSelection
      .append("path")
      .datum(flagAggregatedData)
      .attr("fill", "none")
      .attr("stroke", flagColor)
      .attr("stroke-width", STROKE_WIDTH)
      .attr("stroke-opacity", 1)
      .attr("d", flagMedianLine)
      .attr("class", `flag-line-${flagAbbrev}`);
  });
};
