import { ShortDataPoint } from "@/types/data/run";

export const getFinalCH4Points = (
  array1: ShortDataPoint[],
  array2: ShortDataPoint[],
): ShortDataPoint[] => {
  const finalDataPoints = [];

  for (let i = 0; i < array1.length; i++) {
    const energyPoint = array1[i];
    const afoluPoint = array2[i];

    if (energyPoint.year !== afoluPoint.year) {
      continue;
    }

    const finalPoint = {
      year: energyPoint.year,
      value: energyPoint.value + afoluPoint.value,
    };

    finalDataPoints.push(finalPoint);
  }

  return finalDataPoints.sort((a, b) => a.year - b.year);
};
