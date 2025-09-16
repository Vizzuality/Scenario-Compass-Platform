import { describe, it, expect } from "vitest";
import { extractDataPoints } from "@/hooks/runs/filtering/utils";
import { kyotoDataSet } from "@/tests/filtering/utils";

describe("extractDataPoints", () => {
  it("should return empty array when data is undefined", () => {
    const result = extractDataPoints(undefined);
    expect(result).toEqual([]);
  });

  it("should extract all 15 data points correctly", () => {
    const result = extractDataPoints(kyotoDataSet);

    expect(result).toHaveLength(15);

    expect(result[0]).toEqual({
      runId: 721,
      scenarioName: "SHAPE-SDP-MC-1.5°C",
      modelName: "REMIND-MAgPIE 3.2-4.6",
      year: 2040,
      value: 1340.3221,
      variable: "Emissions|Kyoto Gases",
      unit: "Mt CO2-equiv/yr",
    });

    expect(result[14]).toEqual({
      runId: 720,
      scenarioName: "SHAPE-SDP-EI-1.5°C",
      modelName: "REMIND-MAgPIE 3.2-4.6",
      year: 2050,
      value: 469.8976,
      variable: "Emissions|Kyoto Gases",
      unit: "Mt CO2-equiv/yr",
    });
  });

  it("should extract correct data types", () => {
    const result = extractDataPoints(kyotoDataSet);

    expect(typeof result[0].runId).toBe("number");
    expect(typeof result[0].scenarioName).toBe("string");
    expect(typeof result[0].modelName).toBe("string");
    expect(typeof result[0].year).toBe("number");
    expect(typeof result[0].value).toBe("number");
    expect(typeof result[0].variable).toBe("string");
    expect(typeof result[0].unit).toBe("string");
  });
});
