import { describe, it, expect } from "vitest";
import { EnergyShareMap } from "@/hooks/runs/filtering/use-compute-energy-share";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import {
  createEnergyShareMetaIndicators,
  createForestAreaMetaIndicator,
  createShortDataPoints,
  createShortMetaIndicators,
} from "@/hooks/runs/utils/utils";
import { DataPoint } from "@/components/plots/types";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

const sampleDataPoints: DataPoint[] = [
  {
    runId: "721",
    scenarioName: "SHAPE-SDP-MC-1.5°C",
    modelName: "REMIND-MAgPIE 3.2-4.6",
    year: 2050,
    value: 555.9932,
    variable: "Emissions|Kyoto Gases",
    unit: "Mt CO2-equiv/yr",
  },
  {
    runId: "721",
    scenarioName: "SHAPE-SDP-MC-1.5°C",
    modelName: "REMIND-MAgPIE 3.2-4.6",
    year: 2040,
    value: 1340.3221,
    variable: "Emissions|Kyoto Gases",
    unit: "Mt CO2-equiv/yr",
  },
  {
    runId: "721",
    scenarioName: "SHAPE-SDP-MC-1.5°C",
    modelName: "REMIND-MAgPIE 3.2-4.6",
    year: 2045,
    value: 894.9178,
    variable: "Emissions|Kyoto Gases",
    unit: "Mt CO2-equiv/yr",
  },
];

const sampleMetaIndicators: MetaIndicator[] = [
  {
    runId: "721",
    key: RENEWABLES_SHARE_2050,
    value: "1.5",
  },
  {
    runId: "721",
    key: FOSSIL_SHARE_2050,
    value: "400",
  },
  {
    runId: "722",
    key: BIOMASS_SHARE_2050,
    value: "0.85",
  },
];

const sampleEnergyShares: EnergyShareMap = {
  "721": {
    [RENEWABLES_SHARE_2050]: 0.75,
    [FOSSIL_SHARE_2050]: 0.15,
    [BIOMASS_SHARE_2050]: 0.1,
  },
  "722": {
    [RENEWABLES_SHARE_2050]: 0.6,
    [FOSSIL_SHARE_2050]: 0.3,
    [BIOMASS_SHARE_2050]: 0.1,
  },
};

const sampleForestAreaIncreases = {
  "721": 25.5,
  "722": 18.2,
  "723": 0,
};

describe("createShortDataPoints", () => {
  it("should convert DataPoints to ShortDataPoints with only year and value", () => {
    const result = createShortDataPoints(sampleDataPoints);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ year: 2040, value: 1340.3221 });
    expect(result[1]).toEqual({ year: 2045, value: 894.9178 });
    expect(result[2]).toEqual({ year: 2050, value: 555.9932 });
  });

  it("should sort ShortDataPoints by year in ascending order", () => {
    const result = createShortDataPoints(sampleDataPoints);

    expect(result[0].year).toBe(2040);
    expect(result[1].year).toBe(2045);
    expect(result[2].year).toBe(2050);

    for (let i = 1; i < result.length; i++) {
      expect(result[i].year).toBeGreaterThanOrEqual(result[i - 1].year);
    }
  });

  it("should handle empty array", () => {
    const result = createShortDataPoints([]);
    expect(result).toEqual([]);
  });

  it("should handle single data point", () => {
    const singlePoint = [sampleDataPoints[0]];
    const result = createShortDataPoints(singlePoint);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ year: 2050, value: 555.9932 });
  });

  it("should preserve all values while sorting", () => {
    const unsortedPoints: DataPoint[] = [
      { ...sampleDataPoints[0], year: 2060, value: 100 },
      { ...sampleDataPoints[0], year: 2030, value: 300 },
      { ...sampleDataPoints[0], year: 2050, value: 200 },
    ];

    const result = createShortDataPoints(unsortedPoints);

    expect(result).toEqual([
      { year: 2030, value: 300 },
      { year: 2050, value: 200 },
      { year: 2060, value: 100 },
    ]);
  });
});

describe("createShortMetaIndicators", () => {
  it("should convert MetaIndicators to ShortMetaIndicators with only key and value", () => {
    const result = createShortMetaIndicators(sampleMetaIndicators);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ key: RENEWABLES_SHARE_2050, value: "1.5" });
    expect(result[1]).toEqual({ key: FOSSIL_SHARE_2050, value: "400" });
    expect(result[2]).toEqual({ key: BIOMASS_SHARE_2050, value: "0.85" });
  });

  it("should handle empty array", () => {
    const result = createShortMetaIndicators([]);
    expect(result).toEqual([]);
  });

  it("should preserve order of input array", () => {
    const result = createShortMetaIndicators(sampleMetaIndicators);

    expect(result[0].key).toBe(RENEWABLES_SHARE_2050);
    expect(result[1].key).toBe(FOSSIL_SHARE_2050);
    expect(result[2].key).toBe(BIOMASS_SHARE_2050);
  });
});

describe("createEnergyShareMetaIndicators", () => {
  it("should create energy share meta indicators for valid runId", () => {
    const result = createEnergyShareMetaIndicators(sampleEnergyShares, "721");

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { key: RENEWABLES_SHARE_2050, value: "0.75" },
      { key: FOSSIL_SHARE_2050, value: "0.15" },
      { key: BIOMASS_SHARE_2050, value: "0.1" },
    ]);
  });

  it("should return empty array when energyShares is null", () => {
    const result = createEnergyShareMetaIndicators(null, "721");
    expect(result).toEqual([]);
  });

  it("should return empty array when energyShares is undefined", () => {
    const result = createEnergyShareMetaIndicators(undefined, "721");
    expect(result).toEqual([]);
  });

  it("should return empty array when runId does not exist in energyShares", () => {
    const result = createEnergyShareMetaIndicators(sampleEnergyShares, "999");
    expect(result).toEqual([]);
  });

  it("should convert numbers to strings correctly", () => {
    const result = createEnergyShareMetaIndicators(sampleEnergyShares, "722");

    expect(typeof result[0].value).toBe("string");
    expect(typeof result[1].value).toBe("string");
    expect(typeof result[2].value).toBe("string");

    expect(result).toEqual([
      { key: RENEWABLES_SHARE_2050, value: "0.6" },
      { key: FOSSIL_SHARE_2050, value: "0.3" },
      { key: BIOMASS_SHARE_2050, value: "0.1" },
    ]);
  });

  it("should handle zero values", () => {
    const zeroEnergyShares: EnergyShareMap = {
      test: {
        [RENEWABLES_SHARE_2050]: 0,
        [FOSSIL_SHARE_2050]: 0,
        [BIOMASS_SHARE_2050]: 0,
      },
    };

    const result = createEnergyShareMetaIndicators(zeroEnergyShares, "test");

    expect(result).toEqual([
      { key: RENEWABLES_SHARE_2050, value: "0" },
      { key: FOSSIL_SHARE_2050, value: "0" },
      { key: BIOMASS_SHARE_2050, value: "0" },
    ]);
  });
});

describe("createForestAreaMetaIndicator", () => {
  it("should create forest area meta indicator for valid runId", () => {
    const result = createForestAreaMetaIndicator(sampleForestAreaIncreases, "721");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
      value: "25.5",
    });
  });

  it("should return empty array when forestAreaIncreases is null", () => {
    const result = createForestAreaMetaIndicator(null, "721");
    expect(result).toEqual([]);
  });

  it("should return empty array when forestAreaIncreases is undefined", () => {
    const result = createForestAreaMetaIndicator(undefined, "721");
    expect(result).toEqual([]);
  });

  it("should return empty array when runId does not exist", () => {
    const result = createForestAreaMetaIndicator(sampleForestAreaIncreases, "999");
    expect(result).toEqual([]);
  });

  it("should handle zero values correctly", () => {
    const result = createForestAreaMetaIndicator(sampleForestAreaIncreases, "723");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
      value: "0",
    });
  });

  it("should convert numbers to strings correctly", () => {
    const result = createForestAreaMetaIndicator(sampleForestAreaIncreases, "722");

    expect(typeof result[0].value).toBe("string");
    expect(result[0].value).toBe("18.2");
  });

  it("should handle negative values", () => {
    const negativeForestArea = {
      negative: -5.2,
    };

    const result = createForestAreaMetaIndicator(negativeForestArea, "negative");

    expect(result[0]).toEqual({
      key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
      value: "-5.2",
    });
  });
});
