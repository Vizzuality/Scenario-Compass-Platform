import { describe, it, expect } from "vitest";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";
import { matchesSliderValue } from "@/hooks/runs/utils";
import { createMockRun } from "@/tests/filtering/utils";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";

describe("matchesSliderValue", () => {
  describe("when energy filter is null or invalid", () => {
    const mockRun = createMockRun([{ key: RENEWABLES_SHARE_2050, value: "37.48" }]);

    it("should return true when energy is null", () => {
      const result = matchesSliderValue(mockRun, null);
      expect(result).toBe(true);
    });

    it("should return true when energy array is empty", () => {
      const result = matchesSliderValue(mockRun, []);
      expect(result).toBe(true);
    });

    it("should return true when energy array has only one element", () => {
      const result = matchesSliderValue(mockRun, [RENEWABLES_SHARE_2050]);
      expect(result).toBe(true);
    });
  });

  describe("when run has no metaIndicators", () => {
    it("should return false when metaIndicators is empty array", () => {
      const runWithEmptyMeta = createMockRun([]);

      const result = matchesSliderValue(runWithEmptyMeta, [RENEWABLES_SHARE_2050, "30|50"]);
      expect(result).toBe(false);
    });
  });

  describe("range parsing and validation", () => {
    const mockRun = createMockRun([{ key: RENEWABLES_SHARE_2050, value: "40" }]);

    it("should return false when range format is invalid (no separator)", () => {
      const result = matchesSliderValue(mockRun, ["renewablesShare", "30|50"]);
      expect(result).toBe(false);
    });

    it("should return false when range format is invalid (single value)", () => {
      const result = matchesSliderValue(mockRun, [RENEWABLES_SHARE_2050, "40"]);
      expect(result).toBe(false);
    });

    it("should return false when min value is not a number", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `abc${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });

    it("should return false when max value is not a number", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `30${URL_VALUES_FILTER_SEPARATOR}xyz`,
      ]);
      expect(result).toBe(false);
    });

    it("should return false when both values are not numbers", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `abc${URL_VALUES_FILTER_SEPARATOR}xyz`,
      ]);
      expect(result).toBe(false);
    });

    it("should handle empty range values", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `${URL_VALUES_FILTER_SEPARATOR}`,
      ]);
      expect(result).toBe(false);
    });
  });

  describe("successful range matching", () => {
    const mockRun = createMockRun([
      { key: RENEWABLES_SHARE_2050, value: "40.5" },
      { key: FOSSIL_SHARE_2050, value: "25.75" },
      { key: BIOMASS_SHARE_2050, value: "33.75" },
    ]);

    it("should match when value is within range", () => {
      const result = matchesSliderValue(mockRun, [
        "renewablesShare",
        `30${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(true);
    });

    it("should match when value equals minimum boundary", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `40.5${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(true);
    });

    it("should match when value equals maximum boundary", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `30${URL_VALUES_FILTER_SEPARATOR}40.5`,
      ]);
      expect(result).toBe(true);
    });

    it("should match when value equals both boundaries (single point range)", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `40.5${URL_VALUES_FILTER_SEPARATOR}40.5`,
      ]);
      expect(result).toBe(true);
    });

    it("should match different keys correctly", () => {
      const result = matchesSliderValue(mockRun, [
        FOSSIL_SHARE_2050,
        `20${URL_VALUES_FILTER_SEPARATOR}30`,
      ]);
      expect(result).toBe(true);
    });
  });

  describe("range matching failures", () => {
    const mockRun = createMockRun([
      { key: RENEWABLES_SHARE_2050, value: "15.5" },
      { key: FOSSIL_SHARE_2050, value: "85.2" },
    ]);

    it("should not match when value is below minimum", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `20${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });

    it("should not match when value is above maximum", () => {
      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `10${URL_VALUES_FILTER_SEPARATOR}15`,
      ]);
      expect(result).toBe(false);
    });

    it("should not match when key does not exist", () => {
      const result = matchesSliderValue(mockRun, [
        "nonExistentKey",
        `10${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });
  });

  describe("invalid meta indicator values", () => {
    it("should return false when meta indicator value is not a number", () => {
      const mockRun = createMockRun([{ key: RENEWABLES_SHARE_2050, value: "not-a-number" }]);

      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `30${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });

    it("should return false when meta indicator value is empty string", () => {
      const mockRun = createMockRun([{ key: RENEWABLES_SHARE_2050, value: "" }]);

      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `30${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });

    it("should return false when meta indicator value contains text with numbers", () => {
      const mockRun = createMockRun([{ key: RENEWABLES_SHARE_2050, value: "40 percent" }]);

      const result = matchesSliderValue(mockRun, [
        RENEWABLES_SHARE_2050,
        `30${URL_VALUES_FILTER_SEPARATOR}50`,
      ]);
      expect(result).toBe(false);
    });
  });

  describe("negative ranges and values", () => {
    const mockRun = createMockRun([
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "-5.2" },
      { key: "netEmissions", value: "10.5" },
      { key: "zeroValue", value: "0" },
    ]);

    it("should handle negative values within negative range", () => {
      const result = matchesSliderValue(mockRun, [
        INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
        `-10${URL_VALUES_FILTER_SEPARATOR}-2`,
      ]);
      expect(result).toBe(true);
    });

    it("should handle negative values outside negative range", () => {
      const result = matchesSliderValue(mockRun, [
        INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
        `-3${URL_VALUES_FILTER_SEPARATOR}-1`,
      ]);
      expect(result).toBe(false);
    });

    it("should handle ranges spanning negative to positive", () => {
      const result = matchesSliderValue(mockRun, [
        INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
        `-10${URL_VALUES_FILTER_SEPARATOR}5`,
      ]);
      expect(result).toBe(true);
    });

    it("should handle zero value correctly", () => {
      const result = matchesSliderValue(mockRun, [
        "zeroValue",
        `-5${URL_VALUES_FILTER_SEPARATOR}5`,
      ]);
      expect(result).toBe(true);
    });

    it("should handle zero as boundary value", () => {
      const result = matchesSliderValue(mockRun, [
        "zeroValue",
        `0${URL_VALUES_FILTER_SEPARATOR}10`,
      ]);
      expect(result).toBe(true);
    });
  });

  describe("multiple metaIndicators with same key", () => {
    const mockRun = createMockRun([
      { key: "testKey", value: "15" },
      { key: "testKey", value: "25" },
      { key: "testKey", value: "35" },
      { key: "otherKey", value: "40" },
    ]);

    it("should match when at least one value is in range", () => {
      const result = matchesSliderValue(mockRun, ["testKey", `20${URL_VALUES_FILTER_SEPARATOR}30`]);
      expect(result).toBe(true);
    });

    it("should not match when no values are in range", () => {
      const result = matchesSliderValue(mockRun, ["testKey", `40${URL_VALUES_FILTER_SEPARATOR}50`]);
      expect(result).toBe(false);
    });
  });

  describe("real-world scenarios with actual data", () => {
    const realWorldRun = createMockRun([
      { key: RENEWABLES_SHARE_2050, value: "37.481125248576916" },
      { key: FOSSIL_SHARE_2050, value: "24.330622966512628" },
      { key: BIOMASS_SHARE_2050, value: "34.881110433677684" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "0" },
    ]);

    it("should correctly filter renewables share in range 35-45%", () => {
      const result = matchesSliderValue(realWorldRun, [
        RENEWABLES_SHARE_2050,
        `35${URL_VALUES_FILTER_SEPARATOR}45`,
      ]);
      expect(result).toBe(true);
    });

    it("should correctly filter fossil share in range 20-30%", () => {
      const result = matchesSliderValue(realWorldRun, [
        FOSSIL_SHARE_2050,
        `20${URL_VALUES_FILTER_SEPARATOR}30`,
      ]);
      expect(result).toBe(true);
    });

    it("should correctly handle forest area increase with zero value", () => {
      const result = matchesSliderValue(realWorldRun, [
        INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
        `-10${URL_VALUES_FILTER_SEPARATOR}10`,
      ]);
      expect(result).toBe(true);
    });

    it("should not match when range is too narrow", () => {
      const result = matchesSliderValue(realWorldRun, [
        RENEWABLES_SHARE_2050,
        `38${URL_VALUES_FILTER_SEPARATOR}39`,
      ]);
      expect(result).toBe(false);
    });
  });

  describe("edge cases with decimal precision", () => {
    const mockRun = createMockRun([{ key: "preciseValue", value: "37.481125248576916" }]);

    it("should handle precise decimal matching", () => {
      const result = matchesSliderValue(mockRun, [
        "preciseValue",
        `37.48${URL_VALUES_FILTER_SEPARATOR}37.49`,
      ]);
      expect(result).toBe(true);
    });

    it("should handle very small ranges", () => {
      const result = matchesSliderValue(mockRun, [
        "preciseValue",
        `37.481${URL_VALUES_FILTER_SEPARATOR}37.482`,
      ]);
      expect(result).toBe(true);
    });

    it("should handle scientific notation in range", () => {
      const scientificRun = createMockRun([{ key: "scientificValue", value: "1e-5" }]);

      const result = matchesSliderValue(scientificRun, [
        "scientificValue",
        `0${URL_VALUES_FILTER_SEPARATOR}0.001`,
      ]);
      expect(result).toBe(true);
    });
  });
});
