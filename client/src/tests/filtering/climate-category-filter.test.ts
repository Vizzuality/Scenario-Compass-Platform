import { describe, it, expect } from "vitest";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  CLIMATE_CATEGORY_META_INDICATOR_KEY,
  YEAR_NET_ZERO_FILTER_CONFIG,
  YEAR_NET_ZERO_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";
import { matchesClimateFilter } from "@/hooks/runs/utils";
import { createMockRun } from "@/tests/filtering/utils";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";

describe("matchesClimateFilter", () => {
  describe("when climate filter is null or invalid", () => {
    const mockRun = createMockRun([
      { key: CLIMATE_CATEGORY_META_INDICATOR_KEY, value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1] },
    ]);

    it("should return true when climate is null", () => {
      const result = matchesClimateFilter(mockRun, null);
      expect(result).toBe(true);
    });

    it("should return true when climate array is empty", () => {
      const result = matchesClimateFilter(mockRun, []);
      expect(result).toBe(true);
    });

    it("should return true when climate array has only one element", () => {
      const result = matchesClimateFilter(mockRun, [CLIMATE_CATEGORY_FILTER_CONFIG.name]);
      expect(result).toBe(true);
    });
  });

  describe("climate category filtering", () => {
    const mockRun = createMockRun([
      { key: CLIMATE_CATEGORY_META_INDICATOR_KEY, value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1] },
      { key: RENEWABLES_SHARE_2050, value: "37.48" },
    ]);

    it("should match when climate category value is found in metaIndicators", () => {
      const climate = [
        CLIMATE_CATEGORY_FILTER_CONFIG.name,
        CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      ];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });

    it("should not match when climate category value is not found", () => {
      const climate = [
        CLIMATE_CATEGORY_FILTER_CONFIG.name,
        CLIMATE_CATEGORY_FILTER_CONFIG.values[5],
      ];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });

    it("should handle partial matches correctly - should not match", () => {
      const climate = [CLIMATE_CATEGORY_FILTER_CONFIG.name, "C1b"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });
  });

  describe("year of net zero filtering", () => {
    const mockRun = createMockRun([
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2067" },
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      },
    ]);

    it("should match when year of net zero value is found", () => {
      const climate = [YEAR_NET_ZERO_FILTER_CONFIG.name, "2067"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });

    it("should not match when year of net zero value is not found", () => {
      const climate = [YEAR_NET_ZERO_FILTER_CONFIG.name, "2055"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });

    it("should not match when net zero key exists but with different value", () => {
      const climate = [YEAR_NET_ZERO_FILTER_CONFIG.name, "2070"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });
  });

  describe("custom key-value filtering", () => {
    const mockRun = createMockRun([
      { key: RENEWABLES_SHARE_2050, value: "37.48" },
      { key: FOSSIL_SHARE_2050, value: "24.33" },
      { key: "customKey", value: "customValue" },
    ]);

    it("should match when custom key-value pair is found", () => {
      const climate = [RENEWABLES_SHARE_2050, "37.48"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });

    it("should not match when key exists but value is different", () => {
      const climate = [RENEWABLES_SHARE_2050, "40.0"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });

    it("should not match when key does not exist", () => {
      const climate = ["nonExistentKey", "someValue"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });

    it("should match custom key-value pairs", () => {
      const climate = ["customKey", "customValue"];

      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle runs with multiple matching metaIndicators", () => {
      const mockRun = createMockRun([
        { key: "duplicateKey", value: "value1" },
        { key: "duplicateKey", value: "value2" },
        { key: "otherKey", value: "otherValue" },
      ]);

      const climate = ["duplicateKey", "value1"];
      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });

    it("should handle empty string values", () => {
      const mockRun = createMockRun([
        { key: "emptyKey", value: "" },
        { key: "normalKey", value: "normalValue" },
      ]);

      const climate = ["emptyKey", ""];
      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });

    it("should be case sensitive for values", () => {
      const mockRun = createMockRun([{ key: "testKey", value: "TestValue" }]);

      const climate = ["testKey", "testvalue"];
      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(false);
    });

    it("should handle numeric-like string values", () => {
      const mockRun = createMockRun([{ key: "numericKey", value: "2067" }]);

      const climate = ["numericKey", "2067"];
      const result = matchesClimateFilter(mockRun, climate);
      expect(result).toBe(true);
    });
  });

  describe("real-world scenarios", () => {
    const realWorldRun = createMockRun([
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[4],
      },
      { key: RENEWABLES_SHARE_2050, value: "4.787279514433078" },
      { key: FOSSIL_SHARE_2050, value: "89.23511178234342" },
      { key: BIOMASS_SHARE_2050, value: "0" },
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2100" },
    ]);

    it("should correctly filter by C7 climate category", () => {
      const climate = [
        CLIMATE_CATEGORY_FILTER_CONFIG.name,
        CLIMATE_CATEGORY_FILTER_CONFIG.values[4],
      ];

      const result = matchesClimateFilter(realWorldRun, climate);
      expect(result).toBe(true);
    });

    it("should correctly filter by net zero year 2100", () => {
      const climate = [YEAR_NET_ZERO_FILTER_CONFIG.name, "2100"];

      const result = matchesClimateFilter(realWorldRun, climate);
      expect(result).toBe(true);
    });

    it("should not match different climate category", () => {
      const climate = [
        CLIMATE_CATEGORY_FILTER_CONFIG.name,
        CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      ];

      const result = matchesClimateFilter(realWorldRun, climate);
      expect(result).toBe(false);
    });
  });
});
