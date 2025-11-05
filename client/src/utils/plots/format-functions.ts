import * as d3 from "d3";

export const formatShortenedNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    const millions = value / 1000000;
    return millions % 1 === 0 ? millions + "M" : millions.toFixed(1) + "M";
  } else if (Math.abs(value) >= 1000) {
    const thousands = value / 1000;
    return thousands % 1 === 0 ? thousands + "k" : thousands.toFixed(1) + "k";
  } else {
    return value.toString();
  }
};

export const formatNumber = (value: number, precision: number = 2): string => {
  if (Math.abs(value) >= 1e6) {
    return d3.format(`.${precision}s`)(value);
  } else if (Math.abs(value) >= 1000) {
    return d3.format(",.0f")(value);
  } else {
    return d3.format(`.${precision}~f`)(value);
  }
};
