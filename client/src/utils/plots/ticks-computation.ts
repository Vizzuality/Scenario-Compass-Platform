export const calculateOptimalTicksWithNiceYears = (
  years: number[],
  availableWidth: number,
): number[] => {
  const MINIMUM_PIXELS_BETWEEN_TICKS = 40;

  const MAXIMUM_TICKS_WE_CAN_DISPLAY = Math.floor(availableWidth / MINIMUM_PIXELS_BETWEEN_TICKS);

  if (years.length <= 2) {
    return years;
  }

  if (years.length <= MAXIMUM_TICKS_WE_CAN_DISPLAY) {
    return years;
  }

  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const yearSpan = lastYear - firstYear;

  if (yearSpan <= 10) {
    return [firstYear, lastYear];
  }

  const allDecades = [];
  for (let year = Math.ceil(firstYear / 10) * 10; year < lastYear; year += 10) {
    if (years.includes(year)) {
      allDecades.push(year);
    }
  }

  return [firstYear, ...allDecades, lastYear];
};
