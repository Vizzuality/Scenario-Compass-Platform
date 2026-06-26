"use client";

import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";
import queryKeys from "@/lib/query-keys";
import { getDataPointsFilter } from "@/utils/filtering/data-points-filter";
import { DataPoint } from "@/types/data/data-point";
import { ExtendedRun } from "@/types/data/run";
import useBaseRunTransformation from "@/hooks/runs/data-pipeline/use-base-run-transformation";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import {
  useScatterLegend,
  LegendItem,
} from "@/hooks/guided-exploration/figure-one/use-scatter-legend";
import { IS_PART_OF_AR_6 } from "@/lib/config/reasons-of-concern/category-config";
import {
  CAPACITY_ELECTRICITY_SOLAR,
  CAPACITY_ELECTRICITY_WIND,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";
import { useFigureOneUrlParams } from "@/hooks/nuqs/url-params/use-figure-one-url-params";

export type FigureOneDataPoint = Omit<DataPoint, "value"> & {
  xValue: number;
  yValue: number;
  run: ExtendedRun;
};

export interface FigureOneDefaults {
  year: number;
  xVariable: string;
  yVariable: string;
  geography?: string;
}

interface UseFigureOneReturn {
  data: FigureOneDataPoint[];
  legendItems: LegendItem[];
  isLoading: boolean;
  isError: boolean;

  year: string | null;
  setYear: (value: string | number | null) => Promise<URLSearchParams>;

  geography: string | null;
  setGeography: (value: string | null) => Promise<URLSearchParams>;

  xVariable: string;
  setXVariable: (value: string | null) => Promise<URLSearchParams>;

  yVariable: string;
  setYVariable: (value: string | null) => Promise<URLSearchParams>;

  xUnit: string;
  yUnit: string;

  resetFigureOneControls: () => Promise<void>;
}

const DEFAULT_FIGURE_ONE_VALUES: FigureOneDefaults = {
  year: 2030,
  xVariable: CAPACITY_ELECTRICITY_SOLAR,
  yVariable: CAPACITY_ELECTRICITY_WIND,
};

export function useFigureOne(): UseFigureOneReturn {
  const {
    year,
    setYear,
    geography,
    setGeography,
    xVariable,
    setXVariable,
    yVariable,
    setYVariable,
    resetFigureOneUrlParams,
  } = useFigureOneUrlParams({ defaultValues: DEFAULT_FIGURE_ONE_VALUES });

  const resetFigureOneControls = useCallback(async () => {
    await resetFigureOneUrlParams();
  }, [resetFigureOneUrlParams]);

  const activeGeography = geography || geographyConfig[0].id;

  const filterX = getDataPointsFilter({
    geography: activeGeography,
    year,
    variable: xVariable,
  });

  const filterY = getDataPointsFilter({
    geography: activeGeography,
    year,
    variable: yVariable,
  });

  const {
    data: dataX,
    isLoading: isXLoading,
    isError: isXError,
  } = useQuery({
    ...queryKeys.dataPoints.tabulate(filterX),
    select: (data) => extractDataPoints(data),
  });

  const {
    data: dataY,
    isLoading: isYLoading,
    isError: isYError,
  } = useQuery({
    ...queryKeys.dataPoints.tabulate(filterY),
    select: (data) => extractDataPoints(data),
  });

  const {
    runs,
    isLoading: isRunsLoading,
    isError: isRunsError,
  } = useBaseRunTransformation({ dataPoints: dataX });

  const { legendItems, showVetted, showUnvetted } = useScatterLegend();

  const allPoints = useMemo((): FigureOneDataPoint[] => {
    if (!dataX?.length || !dataY?.length || !runs?.length) return [];

    const runMap = new Map<string, ExtendedRun>(runs.map((r) => [r.runId, r]));

    const xMap = new Map<string, DataPoint>(dataX.map((d) => [String(d.runId), d]));

    const yMap = new Map<string, DataPoint>(dataY.map((d) => [String(d.runId), d]));

    return [...xMap.keys()]
      .filter((id) => yMap.has(id) && runMap.has(id))
      .map((id) => {
        const xPoint = xMap.get(id)!;
        const yPoint = yMap.get(id)!;
        const { value: xValue, ...rest } = xPoint;

        return {
          ...rest,
          xValue,
          yValue: yPoint.value,
          run: runMap.get(id)!,
        };
      });
  }, [dataX, dataY, runs]);

  const data = useMemo(() => {
    return allPoints.filter((d) => {
      const isVetted = d.run.metaIndicators.some(
        (mi) => mi.key === IS_PART_OF_AR_6 && mi.value === "true",
      );

      return isVetted ? showVetted : showUnvetted;
    });
  }, [allPoints, showVetted, showUnvetted]);

  const xUnit = runs?.find((r) => dataX?.some((d) => String(d.runId) === r.runId))?.unit ?? "";

  const yUnit = runs?.find((r) => dataY?.some((d) => String(d.runId) === r.runId))?.unit ?? "";

  return {
    data,
    legendItems,
    isLoading: isXLoading || isYLoading || isRunsLoading,
    isError: isXError || isYError || isRunsError,

    year,
    setYear,

    geography,
    setGeography,

    xVariable,
    setXVariable,

    yVariable,
    setYVariable,

    xUnit,
    yUnit,

    resetFigureOneControls,
  };
}
