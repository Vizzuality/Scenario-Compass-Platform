import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataFrame } from "@iiasa/ixmp4-ts";

interface ChartProps {
  data: DataFrame;
  width?: number;
  height?: number;
}

interface DataPoint {
  scenario: string;
  step_year: number;
  value: number;
  unit?: string;
  variable?: string;
  region?: string;
}

const CHART_CONFIG = {
  margin: { top: 30, right: 150, bottom: 50, left: 80 },
  generateColors: (numColors: number) => {
    return d3.range(numColors).map((i) => d3.interpolateViridis(i / (numColors - 1)));
  },
  pointRadius: 3,
  lineWidth: 2.5,
  hoverLineWidth: 4,
} as const;

export const DemoPlot: React.FC<ChartProps> = ({ data, width = 900, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  useEffect(() => {
    if (!data || data.shape[0] === 0 || !svgRef.current) return;

    const dataPoints: DataPoint[] = [];
    const [rows] = data.shape;
    const columns = data.columns;

    const scenarioIndex = columns.findIndex((col) => col.toLowerCase().includes("scenario"));
    const yearIndex = columns.findIndex(
      (col) => col.toLowerCase().includes("year") || col === "step_year",
    );
    const valueIndex = columns.findIndex((col) => col.toLowerCase().includes("value"));
    const unitIndex = columns.findIndex((col) => col.toLowerCase().includes("unit"));
    const variableIndex = columns.findIndex((col) => col.toLowerCase().includes("variable"));
    const regionIndex = columns.findIndex((col) => col.toLowerCase().includes("region"));

    if (scenarioIndex === -1 || yearIndex === -1 || valueIndex === -1) {
      console.error("Required columns not found. Need: scenario, year, value");
      return;
    }

    for (let i = 0; i < rows; i++) {
      const scenario = data.at(i, columns[scenarioIndex]);
      const step_year = data.at(i, columns[yearIndex]);
      const value = data.at(i, columns[valueIndex]);

      if (scenario == null || step_year == null || value == null) continue;

      dataPoints.push({
        scenario: String(scenario),
        step_year: Number(step_year),
        value: Number(value),
        unit: unitIndex >= 0 ? String(data.at(i, columns[unitIndex]) || "") : undefined,
        variable: variableIndex >= 0 ? String(data.at(i, columns[variableIndex]) || "") : undefined,
        region: regionIndex >= 0 ? String(data.at(i, columns[regionIndex]) || "") : undefined,
      });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { margin } = CHART_CONFIG;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const scenarios = Array.from(new Set(dataPoints.map((d) => d.scenario)));

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataPoints, (d) => d.step_year) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataPoints, (d) => d.value)! * 1.1])
      .range([innerHeight, 0]);

    const colorScale = d3
      .scaleOrdinal(CHART_CONFIG.generateColors(scenarios.length))
      .domain(scenarios);

    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.step_year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const groupedData = d3.group(dataPoints, (d) => d.scenario);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px");

    // Axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Year");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(`${dataPoints[0]?.variable || "Value"} (${dataPoints[0]?.unit || "units"})`);

    // Title
    if (dataPoints[0]?.region && dataPoints[0]?.variable) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`${dataPoints[0].region}: ${dataPoints[0].variable}`);
    }

    // Group scenarios by identical paths
    const pathGroups = new Map<string, string[]>();
    groupedData.forEach((values, scenario) => {
      const sortedValues = values.sort((a, b) => a.step_year - b.step_year);
      const pathKey = sortedValues.map((d) => `${d.step_year}-${d.value}`).join("|");

      if (!pathGroups.has(pathKey)) {
        pathGroups.set(pathKey, []);
      }
      pathGroups.get(pathKey)!.push(scenario);
    });

    // Draw lines and points for each unique path
    const drawnPaths = new Set<string>();
    groupedData.forEach((values, scenario) => {
      const sortedValues = values.sort((a, b) => a.step_year - b.step_year);
      const pathKey = sortedValues.map((d) => `${d.step_year}-${d.value}`).join("|");

      // Skip if we've already drawn this path
      if (drawnPaths.has(pathKey)) return;
      drawnPaths.add(pathKey);

      const identicalScenarios = pathGroups.get(pathKey)!;
      const color = colorScale(scenario);
      const isHovered = identicalScenarios.includes(hoveredScenario || "");
      const isOtherHovered = hoveredScenario && !identicalScenarios.includes(hoveredScenario);

      // Draw line (only once per unique path)
      const pathElement = g
        .append("path")
        .datum(sortedValues)
        .attr("class", `line-${pathKey.replace(/\W/g, "_")}`)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", isHovered ? CHART_CONFIG.hoverLineWidth : CHART_CONFIG.lineWidth)
        .attr("d", line)
        .style("opacity", isOtherHovered ? 0.2 : 0.8)
        .style("cursor", "pointer");

      // Line hover effects
      pathElement
        .on("mouseover", function (event) {
          // Highlight all scenarios that share this path
          identicalScenarios.forEach((s) => setHoveredScenario(s));
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content:
              identicalScenarios.length > 1
                ? `Shared path: ${identicalScenarios.join(", ")}<br/>These scenarios have identical values`
                : `Scenario: ${scenario}<br/>Hover to highlight`,
          });
        })
        .on("mousemove", function (event) {
          setTooltip((prev) =>
            prev
              ? {
                  ...prev,
                  x: event.pageX,
                  y: event.pageY,
                }
              : null,
          );
        })
        .on("mouseout", function () {
          setHoveredScenario(null);
          setTooltip(null);
        });

      // Points removed for cleaner appearance
    });

    // Enhanced legend with grouping for identical paths
    const legendData = scenarios.map((scenario) => {
      const sortedValues = groupedData.get(scenario)!.sort((a, b) => a.step_year - b.step_year);
      const pathKey = sortedValues.map((d) => `${d.step_year}-${d.value}`).join("|");
      const identicalScenarios = pathGroups.get(pathKey)!;

      return {
        scenario,
        pathKey,
        identicalScenarios,
        isRepresentative: identicalScenarios[0] === scenario, // Only show first scenario for each path
      };
    });

    const legend = g.append("g").attr("transform", `translate(${innerWidth + 20}, 20)`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData.filter((d) => d.isRepresentative))
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 30})`)
      .style("cursor", "pointer");

    legendItems
      .append("line")
      .attr("x1", 0)
      .attr("x2", 20)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", (d) => colorScale(d.scenario))
      .attr("stroke-width", CHART_CONFIG.lineWidth);

    legendItems
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 0)
      .attr("r", 3)
      .attr("fill", (d) => colorScale(d.scenario));

    // Main scenario name
    legendItems
      .append("text")
      .attr("x", 25)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .text((d) =>
        d.identicalScenarios.length > 1 ? `${d.identicalScenarios.length} scenarios` : d.scenario,
      );

    // Additional scenarios (if any)
    legendItems
      .filter((d) => d.identicalScenarios.length > 1)
      .append("text")
      .attr("x", 25)
      .attr("y", 12)
      .style("font-size", "9px")
      .style("fill", "#666")
      .style("font-style", "italic")
      .text((d) => d.identicalScenarios.join(", "));

    // Legend hover effects
    legendItems
      .on("mouseover", function (event, d) {
        d.identicalScenarios.forEach((s) => setHoveredScenario(s));
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content:
            d.identicalScenarios.length > 1
              ? `Scenarios with identical paths:<br/>${d.identicalScenarios.join("<br/>")}`
              : `Hover over ${d.scenario}`,
        });
      })
      .on("mousemove", function (event) {
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: event.pageX,
                y: event.pageY,
              }
            : null,
        );
      })
      .on("mouseout", function () {
        setHoveredScenario(null);
        setTooltip(null);
      });
  }, [data, width, height, hoveredScenario]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
          }}
        >
          <div>
            <strong>Multi-line Chart:</strong> Rows: {data.shape[0]} | Columns: {data.shape[1]} |
            Scenarios: {Array.from(new Set(data.columns)).length > 0 ? "Multiple" : "Loading..."}
          </div>
          <div style={{ marginTop: "4px", fontStyle: "italic" }}>
            Scenarios with identical paths are grouped together. Hover to see which scenarios share
            the same line.
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 1000,
            maxWidth: "200px",
            lineHeight: "1.4",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};
