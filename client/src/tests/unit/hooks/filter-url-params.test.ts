import { renderHook, waitFor } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";

describe("useFilterUrlParams", () => {
  it("should initialize with empty values", () => {
    const { result } = renderHook(() => useFilterUrlParams(), {
      wrapper: withNuqsTestingAdapter(),
    });

    expect(result.current.climateCategory).toEqual([]);
    expect(result.current.renewablesShare).toBeNull();
  });

  it("should parse filters from URL", () => {
    const { result } = renderHook(() => useFilterUrlParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?climateCategory=C1b,C1a&renewablesShare=10:20",
      }),
    });

    expect(result.current.climateCategory).toEqual(["C1b", "C1a"]);
    expect(result.current.renewablesShare).toBe("10:20");
  });

  it("should update filters", async () => {
    const { result } = renderHook(() => useFilterUrlParams(), {
      wrapper: withNuqsTestingAdapter(),
    });

    await result.current.setClimateCategory(["C1b"]);

    await waitFor(() => {
      expect(result.current.climateCategory).toEqual(["C1b"]);
    });
  });

  it("should clear all filters", async () => {
    const { result } = renderHook(() => useFilterUrlParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?climateCategory=C1b&renewablesShare=10:20",
      }),
    });

    await result.current.clearAll();

    await waitFor(() => {
      expect(result.current.climateCategory).toEqual([]);
      expect(result.current.renewablesShare).toBeNull();
    });
  });

  it("should handle prefix", () => {
    const { result } = renderHook(() => useFilterUrlParams("right"), {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?rightClimateCategory=C1b",
      }),
    });

    expect(result.current.climateCategory).toEqual(["C1b"]);
  });
});
