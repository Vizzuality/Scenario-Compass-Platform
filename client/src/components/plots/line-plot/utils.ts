import * as d3 from "d3";
import { DataPoint, ProcessedData } from "@/components/plots/utils/types";
import { PlotDimensions } from "@/components/plots/utils/dimensions";
import {
  BURGUNDY,
  BURGUNDY_LIGHT,
  GRID_STROKE_COLOR,
  GRID_TEXT_COLOR,
  LILAC,
  LILAC_DARK,
  LILAC_LIGHT,
} from "@/components/plots/utils/constants";

export const processChartData = (dataPoints: DataPoint[]): ProcessedData => {
  const modelScenarioPairs = d3.group(dataPoints, (d) => `${d.model}|${d.scenario}`);

  const xDomain = d3.extent(dataPoints, (d) => d.year) as [number, number];
  const yDomain = d3.extent(dataPoints, (d) => d.value) as [number, number];

  return {
    dataPoints,
    scenarios: modelScenarioPairs,
    xDomain,
    yDomain,
  };
};

export const createValueBasedColorMapping = (scenarios: Map<string, DataPoint[]>) => {
  const scenarioAverages = new Map<string, number>();

  scenarios.forEach((points, scenarioKey) => {
    const average = points.reduce((sum, point) => sum + point.value, 0) / points.length;
    scenarioAverages.set(scenarioKey, average);
  });

  const sortedScenarios = Array.from(scenarioAverages.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([scenarioKey]) => scenarioKey);

  const createCustomInterpolation = () => {
    const colorStops = [
      { position: 0.0, color: LILAC_LIGHT },
      { position: 0.25, color: LILAC },
      { position: 0.5, color: LILAC_DARK },
      { position: 0.75, color: BURGUNDY_LIGHT },
      { position: 1.0, color: BURGUNDY },
    ];

    return (t: number) => {
      t = Math.max(0, Math.min(1, t));

      let lowerStop = colorStops[0];
      let upperStop = colorStops[colorStops.length - 1];

      for (let i = 0; i < colorStops.length - 1; i++) {
        if (t >= colorStops[i].position && t <= colorStops[i + 1].position) {
          lowerStop = colorStops[i];
          upperStop = colorStops[i + 1];
          break;
        }
      }

      const localT = (t - lowerStop.position) / (upperStop.position - lowerStop.position);

      return d3.interpolateRgb(lowerStop.color, upperStop.color)(localT);
    };
  };

  const colorMap = new Map<string, string>();
  const customInterpolate = createCustomInterpolation();

  sortedScenarios.forEach((scenarioKey, index) => {
    const t = index / Math.max(1, sortedScenarios.length - 1);
    const color = customInterpolate(t);
    colorMap.set(scenarioKey, color);
  });

  return { colorMap, scenarioAverages, sortedScenarios };
};

export const renderLinePlot = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  scenarios: Map<string, DataPoint[]>,
  xDomain: [number, number],
  yDomain: [number, number],
  dimensions: PlotDimensions,
) => {
  svg.selectAll("*").remove();
  const { INNER_WIDTH, INNER_HEIGHT, MARGIN } = dimensions;

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const xScale = d3.scaleLinear().domain(xDomain).range([0, INNER_WIDTH]);
  const yScale = d3.scaleLinear().domain(yDomain).range([INNER_HEIGHT, 0]);

  const { colorMap } = createValueBasedColorMapping(scenarios);

  g.selectAll(".grid-line")
    .data(yScale.ticks(6))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", INNER_WIDTH)
    .attr("y1", yScale)
    .attr("y2", yScale)
    .attr("stroke", GRID_STROKE_COLOR)
    .attr("stroke-width", 1);

  const line = d3
    .line<DataPoint>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  const xAxis = g
    .append("g")
    .attr("transform", `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  const yAxis = g.append("g").call(d3.axisLeft(yScale));

  xAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);
  yAxis.selectAll("path, line").attr("stroke", GRID_STROKE_COLOR);

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -INNER_HEIGHT / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", GRID_TEXT_COLOR)
    .text("Value");

  scenarios.forEach((points, scenarioKey) => {
    const sortedPoints = points.sort((a, b) => a.year - b.year);
    const color = colorMap.get(scenarioKey)!;

    g.append("path")
      .datum(sortedPoints)
      .attr("class", `line-${scenarioKey.replace(/\W/g, "_")}`)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line)
      .append("title");
  });
};
