import { bin, range } from "d3";

export interface BinningResult {
  bins: d3.Bin<number, number>[];
  thresholds: number[];
}

/**
 * Creates bins of equal width across the data's entire range.
 * @param values The raw numeric data.
 * @param xDomain A tuple of [min, max] for the data.
 * @param binCount The desired number of bins.
 * @returns An object containing the calculated bins and their thresholds.
 */
export const createDefaultBins = (
  values: number[],
  xDomain: [number, number],
  binCount: number,
): BinningResult => {
  const binWidth = (xDomain[1] - xDomain[0]) / binCount;
  const thresholds = range(binCount + 1).map((i) => xDomain[0] + i * binWidth);

  let calculatedBins = bin<number, number>().domain(xDomain).thresholds(thresholds)(values);

  // D3 can sometimes create an extra empty bin due to floating point precision.
  // This logic merges any extra bins into the last valid one to ensure we have exactly binCount.
  if (calculatedBins.length > binCount) {
    const lastBin = calculatedBins[binCount - 1];
    for (let i = binCount; i < calculatedBins.length; i++) {
      lastBin.push(...calculatedBins[i]);
    }
    lastBin.x1 = calculatedBins[calculatedBins.length - 1].x1;
    calculatedBins = calculatedBins.slice(0, binCount);
  }

  return { bins: calculatedBins, thresholds };
};

/**
 * Creates histogram bins aligned to decade boundaries (e.g., 1930-1939, 1940-1949).
 * Each bin spans exactly 10 years, regardless of where data points fall within that decade.
 *
 * @remarks
 * This function ensures that data is grouped by complete decades. For example:
 * - Data points from 2036-2039 will all be counted in the 2030-2039 bin
 * - A data point at exactly 2040 will be counted in the 2040-2049 bin
 *
 * The function handles edge cases where the maximum value falls exactly on a decade boundary,
 * ensuring that decade gets its own complete bin with proper thresholds.
 *
 * @example
 * ```typescript
 * Data spanning 2036 to 2040
 * const values = [2036, 2037, 2038, 2040];
 * const xDomain = [2036, 2040];
 * const result = createDecadeBins(values, xDomain);
 * Returns bins for decades: [2030-2040), [2040-2050)
 * With thresholds: [2030, 2040, 2050]
 * ```
 *
 * @param values - The raw numeric data values (typically years)
 * @param xDomain - A tuple of [min, max] representing the data range
 * @returns An object containing the calculated bins and their threshold values
 */
export const createDecadeBins = (values: number[], xDomain: [number, number]): BinningResult => {
  /**
   * Round down to the nearest decade start (e.g., 2036 → 2030, 1995 → 1990)
   * This will be the beginning of the threshold array, threshold[0] is the beginning of labels on X axis
   */
  const startDecade = Math.floor(xDomain[0] / 10) * 10;

  /**
   * Round up to the nearest decade boundary (e.g., 2036 → 2040, 2040 → 2040)
   * This will be the end of the threshold array, - will be further modified to include a padding
   */
  const endDecade = Math.ceil(xDomain[1] / 10) * 10;

  /**
   * Check if the maximum value falls exactly on a decade boundary (e.g., 2100, 2040)
   * This determines if we need an extra threshold to properly close the last bin
   */
  const isEndOfDomainADecadeStart = Math.max(...values) === endDecade;

  /**
   *  @IMPORTANT
   *  Calculate the final threshold value:
   *  If max is exactly on a decade boundary (2100): need +20 to create [2100-2110) bin
   *  If max is within a decade (2102): need +10 since endDecade (2110) already closes the bin
   */
  const endDecadeThreshold = isEndOfDomainADecadeStart ? endDecade + 20 : endDecade + 10;

  /**
   * @IMPORTANT
   * Generate threshold array at 10-year intervals (e.g., [2030, 2040, 2050, ...])
   * D3's range() creates values from start up to (but not including) stop, so for 1930,1940,...,2100 + 20 will have the last item as 2110.
   */
  const thresholds = range(startDecade, endDecadeThreshold, 10);

  /**
   * Create bins using D3's bin generator
   * Domain defines the valid range for binning
   * Thresholds define the exact boundaries between bins
   */
  const bins = bin<number, number>()
    .domain([startDecade, endDecade + 10])
    .thresholds(thresholds)(values);

  return { bins, thresholds };
};
