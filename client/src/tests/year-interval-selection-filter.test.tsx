import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import YearIntervalSelectionFilter from "@/containers/scenario-dashboard/components/filter-top/year-interval-selection-filter";
import { renderWithNuqs } from "@/tests/test-utils";
import { createUrlWithParams } from "@/tests/test-utils";
import {
  SCENARIO_DASHBOARD_SEARCH_PARAMS,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";

class YearFilterPage {
  get checkbox() {
    return screen.getByTestId("multiple-checkbox");
  }
  get yearRangeContainer() {
    return screen.queryByTestId("year-range-container");
  }
  get startYearSelect() {
    return screen.queryByTestId("start-year-select");
  }
  get endYearSelect() {
    return screen.queryByTestId("end-year-select");
  }
  get singleYearSelect() {
    return screen.queryByTestId("single-year-select");
  }
  get yearFilter() {
    return screen.getByTestId("year-filter");
  }

  toggleMultipleMode() {
    fireEvent.click(this.checkbox);
  }

  selectStartYear(year: number | string) {
    if (this.startYearSelect) {
      fireEvent.click(this.startYearSelect);
      fireEvent.click(screen.getByText(year.toString()));
    }
  }

  expectSingleMode() {
    expect(this.checkbox).not.toBeChecked();
    expect(this.singleYearSelect).toBeInTheDocument();
    expect(this.yearRangeContainer).not.toBeInTheDocument();
  }

  expectMultipleMode() {
    expect(this.checkbox).toBeChecked();
    expect(this.yearRangeContainer).toBeInTheDocument();
    expect(this.startYearSelect).toBeInTheDocument();
    expect(this.endYearSelect).toBeInTheDocument();
    expect(this.singleYearSelect).not.toBeInTheDocument();
  }

  expectStartYearValue(expectedYear: string | number) {
    expect(this.startYearSelect).toHaveTextContent(String(expectedYear));
  }

  expectEndYearValue(expectedYear: string | number) {
    expect(this.endYearSelect).toHaveTextContent(String(expectedYear));
  }
}

/**
 * Tests for the YearIntervalSelectionFilter component
 *
 * This component allows users to select a year or a range of years
 * and toggles between single and multiple selection modes.
 *
 * Component behavior:
 * - Initially shows a single year selector, unless startYear/endYear params are present
 * - Clicking the "Multiple" checkbox toggles between single and multiple selection modes
 * - In multiple mode, users can select a start and end year
 * - The end year select is disabled until a start year is selected
 * - State is managed via URL parameters (year, startYear, endYear)
 * - Clicking the checkbox clears the current selection
 */

describe("Component Test", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  describe("Initial Render", () => {
    it("renders correctly with default state", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilterInstance = new YearFilterPage();

      expect(yearFilterInstance.yearFilter).toBeInTheDocument();
      expect(yearFilterInstance.checkbox).toBeInTheDocument();
      expect(yearFilterInstance.checkbox).not.toBeChecked();
      expect(yearFilterInstance.singleYearSelect).toBeInTheDocument();
      expect(yearFilterInstance.yearRangeContainer).not.toBeInTheDocument();
      expect(yearFilterInstance.startYearSelect).not.toBeInTheDocument();
      expect(yearFilterInstance.endYearSelect).not.toBeInTheDocument();
    });
  });

  describe("Multiple Selection Toggle", () => {
    it("toggles to multiple selection mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();

      yearFilter.expectMultipleMode();
    });

    it("toggles back to single selection mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      // Toggle to multiple
      yearFilter.toggleMultipleMode();
      yearFilter.expectMultipleMode();

      // Toggle back to single
      yearFilter.toggleMultipleMode();
      yearFilter.expectSingleMode();
    });
  });

  describe("Year Range Selection", () => {
    it("disables end year when no start year is selected", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();

      expect(yearFilter.endYearSelect).toHaveAttribute("disabled");
    });

    it("enables end year after selecting start year via direct interaction", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();
      yearFilter.expectMultipleMode();

      // Initially end year should be disabled
      expect(yearFilter.endYearSelect).toHaveAttribute("disabled");

      // Select a start year
      const firstYear = YEAR_OPTIONS[0];
      yearFilter.selectStartYear(firstYear);

      // Now end year should be enabled
      expect(yearFilter.endYearSelect).not.toHaveAttribute("disabled");
    });
  });

  describe("Year Selection Functionality", () => {
    it("shows single year select in single mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      expect(yearFilter.singleYearSelect).toBeInTheDocument();
    });

    it("shows start and end year selects in multiple mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();

      expect(yearFilter.startYearSelect).toBeInTheDocument();
      expect(yearFilter.endYearSelect).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("clears year when switching to multiple mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();

      expect(yearFilter.singleYearSelect).not.toBeInTheDocument();
      expect(yearFilter.yearRangeContainer).toBeInTheDocument();
    });

    it("clears range when switching to single mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.toggleMultipleMode();
      expect(yearFilter.yearRangeContainer).toBeInTheDocument();

      yearFilter.toggleMultipleMode();
      expect(yearFilter.yearRangeContainer).not.toBeInTheDocument();
      expect(yearFilter.singleYearSelect).toBeInTheDocument();
    });
  });
});

describe("URL Parameter Tests", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  describe("Initial State from URL", () => {
    it("renders with single year from URL parameter", () => {
      const selectedYear = YEAR_OPTIONS[0];
      renderWithNuqs(<YearIntervalSelectionFilter />, {
        searchParams: createUrlWithParams({
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.YEAR]: selectedYear,
        }),
      });

      const yearFilter = new YearFilterPage();
      yearFilter.expectSingleMode();
    });

    it("renders with year range from URL parameters", async () => {
      const startYear = YEAR_OPTIONS[1];
      const endYear = YEAR_OPTIONS[3];
      renderWithNuqs(<YearIntervalSelectionFilter />, {
        searchParams: createUrlWithParams({
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.START_YEAR]: startYear,
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.END_YEAR]: endYear,
        }),
      });

      const yearFilter = new YearFilterPage();
      yearFilter.expectMultipleMode();

      await waitFor(() => {
        yearFilter.expectStartYearValue(startYear);
        yearFilter.expectEndYearValue(endYear);
      });
    });

    it("renders with only start year from URL parameter will trigger the single mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />, {
        searchParams: createUrlWithParams({
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.START_YEAR]: YEAR_OPTIONS[0],
        }),
      });

      const yearFilter = new YearFilterPage();
      yearFilter.expectSingleMode();
    });

    it("prioritizes range parameters over single year parameter", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />, {
        searchParams: createUrlWithParams({
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.YEAR]: YEAR_OPTIONS[2],
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.START_YEAR]: YEAR_OPTIONS[4],
          [SCENARIO_DASHBOARD_SEARCH_PARAMS.END_YEAR]: YEAR_OPTIONS[5],
        }),
      });

      const yearFilter = new YearFilterPage();
      yearFilter.expectMultipleMode();
    });
  });
});
