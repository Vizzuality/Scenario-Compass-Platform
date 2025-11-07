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
 * Creates bins aligned to decades (e.g., 1980, 1990, 2000).
 * Assumes the data values are years.
 * @param values The raw numeric data (as years).
 * @param xDomain A tuple of [min, max] for the data.
 * @returns An object containing the calculated bins and their thresholds.
 */
export const createDecadeBins = (values: number[], xDomain: [number, number]): BinningResult => {
  const startDecade = Math.floor(xDomain[0] / 10) * 10;
  const endDecade = Math.ceil(xDomain[1] / 10) * 10;
  const thresholds = range(startDecade, endDecade + 10, 10);

  const bins = bin<number, number>().domain(xDomain).thresholds(thresholds)(values);

  return { bins, thresholds };
};
