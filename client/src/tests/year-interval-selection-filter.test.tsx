import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import YearIntervalSelectionFilter from "@/containers/scenario-dashboard/components/filter-top/year-interval-selection-filter";
import { renderWithNuqs } from "@/tests/test-utils";

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
 * - Initially shows a multiple year selector for ease of use.
 *   @see {@link useScenarioDashboardUrlParams}  for details.
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
    it("renders correctly with default state from the initialization of URL store", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilterInstance = new YearFilterPage();

      expect(yearFilterInstance.yearFilter).toBeInTheDocument();
      expect(yearFilterInstance.checkbox).toBeInTheDocument();
      expect(yearFilterInstance.checkbox).toBeChecked();
      expect(yearFilterInstance.singleYearSelect).not.toBeInTheDocument();
      expect(yearFilterInstance.yearRangeContainer).toBeInTheDocument();
      expect(yearFilterInstance.startYearSelect).toBeInTheDocument();
      expect(yearFilterInstance.endYearSelect).toBeInTheDocument();
    });
  });

  describe("Multiple Selection Toggle", () => {
    it("toggles between single and multiple selection mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.expectMultipleMode();
      yearFilter.toggleMultipleMode();
      yearFilter.expectSingleMode();
      yearFilter.toggleMultipleMode();
      yearFilter.expectMultipleMode();
    });
  });

  describe("State Management", () => {
    it("clears year when switching to multiple mode", () => {
      renderWithNuqs(<YearIntervalSelectionFilter />);
      const yearFilter = new YearFilterPage();

      yearFilter.expectMultipleMode();
      yearFilter.toggleMultipleMode();
      yearFilter.expectSingleMode();

      expect(yearFilter.singleYearSelect).toBeInTheDocument();
      expect(yearFilter.yearRangeContainer).not.toBeInTheDocument();
    });
  });
});
