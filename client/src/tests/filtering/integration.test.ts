import { describe, it, expect } from "vitest";
import { filterRunsByMetaIndicators } from "@/hooks/runs/utils";
import { createMockRun, sampleRuns } from "@/tests/filtering/utils";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";
import {
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";

describe("filterRunsByMetaIndicators", () => {
  describe("input validation", () => {
    it("should return empty array when runs is empty", () => {
      const result = filterRunsByMetaIndicators({
        runs: [],
        climate: null,
        energy: null,
        land: null,
      });

      expect(result).toEqual([]);
    });
  });

  describe("no filters applied", () => {
    it("should return all runs when no filters are provided", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: null,
        energy: null,
        land: null,
      });

      expect(result).toHaveLength(5);
      expect(result).toEqual(sampleRuns);
    });

    it("should return all runs when all filters are empty arrays", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [],
        energy: [],
        land: [],
      });

      expect(result).toHaveLength(5);
      expect(result).toEqual(sampleRuns);
    });
  });

  describe("single filter applications", () => {
    it("should apply only climate filter", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[4]],
        energy: null,
        land: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("723");
    });

    it("should apply only energy filter", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: null,
        energy: [RENEWABLES_SHARE_2050, `35${URL_VALUES_FILTER_SEPARATOR}45`],
        land: null,
      });

      // Should match runs 721, 722, 724, 720 (all except 723 which has ~4.79%)
      expect(result).toHaveLength(4);
      expect(result.map((r) => r.runId).sort()).toEqual(["720", "721", "722", "724"]);
    });

    it("should apply only land filter", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: null,
        energy: null,
        land: [INCREASE_IN_GLOBAL_FOREST_AREA_KEY, `5${URL_VALUES_FILTER_SEPARATOR}15`],
      });

      // Should match only run 724 which has 10.14%
      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("724");
    });
  });

  describe("multiple filter combinations (AND logic)", () => {
    it("should apply climate AND energy filters", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[1]],
        energy: [RENEWABLES_SHARE_2050, `40${URL_VALUES_FILTER_SEPARATOR}50`],
        land: null,
      });

      // Should match only run 720 (C1b + 42.61% renewables)
      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("720");
    });

    it("should apply energy AND land filters", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: null,
        energy: [FOSSIL_SHARE_2050, `20${URL_VALUES_FILTER_SEPARATOR}30`],
        land: [INCREASE_IN_GLOBAL_FOREST_AREA_KEY, `-1${URL_VALUES_FILTER_SEPARATOR}5`],
      });

      // Should match runs with fossil 20-30% AND forest -1 to 5%
      // Runs 721, 722, 724, 720 have fossil in range, but only 721, 722, 720 have forest in range
      expect(result).toHaveLength(3);
      expect(result.map((r) => r.runId).sort()).toEqual(["720", "721", "722"]);
    });

    it("should apply all three filters", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[4]],
        energy: [FOSSIL_SHARE_2050, `80${URL_VALUES_FILTER_SEPARATOR}95`],
        land: [INCREASE_IN_GLOBAL_FOREST_AREA_KEY, `-5${URL_VALUES_FILTER_SEPARATOR}5`],
      });

      // Should match only run 723 (C7 + 89.24% fossil + 0% forest)
      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("723");
    });
  });

  describe("no matching runs", () => {
    it("should return empty array when no runs match climate filter", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, "Nonexistent Category"],
        energy: null,
        land: null,
      });

      expect(result).toEqual([]);
    });

    it("should return empty array when no runs match energy range", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: null,
        energy: [RENEWABLES_SHARE_2050, `90${URL_VALUES_FILTER_SEPARATOR}100`],
        land: null,
      });

      expect(result).toEqual([]);
    });
  });

  describe("real-world comprehensive filtering scenarios", () => {
    it("should handle filter scenario correctly", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[4]],
        energy: [FOSSIL_SHARE_2050, `12${URL_VALUES_FILTER_SEPARATOR}94`],
        land: [INCREASE_IN_GLOBAL_FOREST_AREA_KEY, `-96${URL_VALUES_FILTER_SEPARATOR}53`],
      });

      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("723");
    });

    it("should filter for aggressive climate scenarios with high renewables", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[1]],
        energy: [RENEWABLES_SHARE_2050, `35${URL_VALUES_FILTER_SEPARATOR}45`],
        land: [INCREASE_IN_GLOBAL_FOREST_AREA_KEY, `-1${URL_VALUES_FILTER_SEPARATOR}1`],
      });

      expect(result).toHaveLength(3);
      expect(result.map((r) => r.runId).sort()).toEqual(["720", "721", "722"]);
    });

    it("should filter by net zero year", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [YEAR_NET_ZERO_FILTER_CONFIG.name, "2055"],
        energy: null,
        land: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0].runId).toBe("724");
    });
  });

  describe("edge cases", () => {
    it("should handle runs with missing metaIndicators", () => {
      const runsWithMissingMeta = [...sampleRuns, createMockRun([], "999")];

      const result = filterRunsByMetaIndicators({
        runs: runsWithMissingMeta,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[1]],
        energy: null,
        land: null,
      });

      expect(result.map((r) => r.runId)).not.toContain("999");
    });

    it("should maintain original array order", () => {
      const result = filterRunsByMetaIndicators({
        runs: sampleRuns,
        climate: [CLIMATE_CATEGORY_FILTER_CONFIG.name, CLIMATE_CATEGORY_FILTER_CONFIG.values[1]], // C1b
        energy: null,
        land: null,
      });

      expect(result.map((r) => r.runId)).toEqual(["721", "722", "720"]);
    });
  });
});
