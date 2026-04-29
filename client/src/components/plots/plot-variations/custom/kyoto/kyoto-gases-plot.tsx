import { PlotContainer, PlotWidgetHeader } from "@/components/plots/components";
import { useGetSingleRunForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-single-run-for-variable-pipeline";
import LoadingDots from "@/components/animations/loading-dots";
import React, { useEffect, useState } from "react";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { ShortRun, ShortRunReturn } from "@/components/plots/plot-variations/custom/kyoto/types";
import { getFinalCH4Points } from "@/components/plots/plot-variations/custom/kyoto/utils";
import CustomPlotLegend from "@/components/plots/plot-variations/custom/kyoto/custom-plot-legend";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { renderKyotoPlot } from "@/components/plots/plot-variations/custom/kyoto/render";
import * as d3 from "d3";
import { ExtendedRun, ShortDataPoint } from "@/types/data/run";
import { OTHER_GASES } from "@/lib/config/plots/plots-constants";
import { renderKyotoBarPlot } from "@/components/plots/plot-variations/custom/kyoto/render-bar";
import { renderKyotoWaterfallPlot } from "@/components/plots/plot-variations/custom/kyoto/render-waterfall";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { ChartDialog } from "@/components/custom/chart-dialog";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components/chart-type-toggle";

const GWP_CH4 = 25;
const GWP_N2O_WITH_UNIT_CONVERSION = 0.298;

const convertGasToMtCO2eq = (runs: ExtendedRun[], multiplier: number) => {
  const converted = structuredClone(runs);
  converted.forEach((run) => {
    run.orderedPoints.forEach((point) => {
      point.value *= multiplier;
    });
  });
  return converted;
};

const createShortRun = (
  variableName: string,
  isLine: boolean,
  orderedPoints: ShortDataPoint[],
): ShortRun => ({
  variableName,
  isLine,
  orderedPoints,
});

const KyotoBasePlot = ({
  data,
  isSingleYear,
  chartType,
}: {
  data: ShortRunReturn;
  isSingleYear: boolean;
  chartType: ChartType;
}) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!data?.shortRuns?.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (!isSingleYear) {
      renderKyotoPlot({ svg, dimensions, data });
      return;
    }

    if (chartType === PLOT_TYPE_OPTIONS.WATERFALL) {
      renderKyotoWaterfallPlot({ svg, dimensions, data });
    } else {
      renderKyotoBarPlot({ svg, dimensions, data });
    }
  }, [data, dimensions, svgRef, isSingleYear, chartType]);

  return plotContainer;
};

// Separate component that owns all hooks — rendered only after loading/error guards pass
function KyotoGasesContent({
  result,
  isSingleYear,
}: {
  result: ShortRunReturn;
  isSingleYear: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [singleYearChartType, setSingleYearChartType] = useState<ChartType>(
    PLOT_TYPE_OPTIONS.STACKED_BAR,
  );

  useEffect(() => {
    const hasNegatives = result.shortRuns
      .filter((r) => !r.isLine)
      .some((r) => r.orderedPoints.some((p) => p.value < 0));
    setSingleYearChartType(
      hasNegatives ? PLOT_TYPE_OPTIONS.WATERFALL : PLOT_TYPE_OPTIONS.STACKED_BAR,
    );
  }, [result.shortRuns]);

  const variables = [OTHER_GASES, "N2O", "CH4", "CO2"];
  const legend = <CustomPlotLegend flagCategory={result.flagCategory} variables={variables} />;
  const plot = (
    <KyotoBasePlot isSingleYear={isSingleYear} data={result} chartType={singleYearChartType} />
  );

  return (
    <>
      <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
        <PlotWidgetHeader
          title="GHG Emissions"
          onExpand={() => setIsDialogOpen(true)}
          chartType={isSingleYear ? singleYearChartType : undefined}
          onChange={isSingleYear ? setSingleYearChartType : undefined}
          toggleOptions={
            isSingleYear ? [PLOT_TYPE_OPTIONS.WATERFALL, PLOT_TYPE_OPTIONS.STACKED_BAR] : undefined
          }
        />
        {legend}
        <PlotContainer>{plot}</PlotContainer>
      </div>

      <ChartDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title="GHG Emissions">
        <div className="flex h-full w-full flex-col">
          {legend}
          <div className="relative min-h-0 flex-1 [&>*]:!aspect-auto [&>*]:!h-full">
            {isDialogOpen && <PlotContainer>{plot}</PlotContainer>}
          </div>
        </div>
      </ChartDialog>
    </>
  );
}

const renderStateComponent = (content: React.ReactNode) => (
  <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
    <PlotWidgetHeader title="GHG Emissions" />
    <PlotContainer>{content}</PlotContainer>
  </div>
);

/**
 * Converts greenhouse gases to common unit: Mt CO2 equivalent per year
 *
 *
 * Input units:
 * - Kyoto gases: Mt CO2eq/year (already converted)
 * - CO2: Mt CO2/year → Mt CO2eq/year (GWP = 1)
 * - CH4 (AFOLU): Mt CH4/year → Mt CO2eq/year (GWP = 25)
 * - CH4 (Energy): Mt CH4/year → Mt CO2eq/year (GWP = 25)
 * - N2O: kt N2O/year → Mt CO2eq/year (GWP = 298, kt to Mt = ÷1000)
 */
export function KyotoGasesPlot() {
  const { startYear, endYear } = useBaseUrlParams();
  const isSingleYear = parseInt(startYear!) === parseInt(endYear!);

  const kyotoGases = useGetSingleRunForVariablePipeline({ variable: "Emissions|Kyoto Gases" });
  const CO2 = useGetSingleRunForVariablePipeline({ variable: "Emissions|CO2" });
  const CH4_AFOLU = useGetSingleRunForVariablePipeline({ variable: "Emissions|CH4|AFOLU" });
  const CH4_ENERGY = useGetSingleRunForVariablePipeline({ variable: "Emissions|CH4|Energy" });
  const N2O = useGetSingleRunForVariablePipeline({ variable: "Emissions|N2O" });

  const isError = [kyotoGases, CO2, CH4_AFOLU, CH4_ENERGY, N2O].some((p) => p.isError);
  const isLoading = [kyotoGases, CO2, CH4_AFOLU, CH4_ENERGY, N2O].some((p) => p.isLoading);
  const isAnyMissingArray = [kyotoGases, CO2, CH4_AFOLU, N2O, CH4_ENERGY].some(
    (p) => p.runs.length === 0,
  );

  if (isLoading) return renderStateComponent(<LoadingDots />);
  if (isError || isAnyMissingArray)
    return renderStateComponent(
      <DataFetchError>
        <>
          <strong>Unable to load data</strong>
          <p className="text-center">
            There is not enough information to compute the <b>GHG Emissions</b> plot for the
            selected parameters.
          </p>
        </>
      </DataFetchError>,
    );

  const CH4_AFOLU_CO2eq = convertGasToMtCO2eq(CH4_AFOLU.runs, GWP_CH4);
  const CH4_ENERGY_CO2eq = convertGasToMtCO2eq(CH4_ENERGY.runs, GWP_CH4);
  const N2O_CO2eq = convertGasToMtCO2eq(N2O.runs, GWP_N2O_WITH_UNIT_CONVERSION);
  const CO2_CO2eq = structuredClone(CO2.runs);

  const FINAL_CH4_CO2eq = getFinalCH4Points(
    CH4_ENERGY_CO2eq[0].orderedPoints,
    CH4_AFOLU_CO2eq[0].orderedPoints,
  );

  const otherGasesPoints: ShortDataPoint[] = kyotoGases.runs[0].orderedPoints.map((kyotoPoint) => {
    const co2Value = CO2_CO2eq[0].orderedPoints.find((p) => p.year === kyotoPoint.year)?.value ?? 0;
    const ch4Value = FINAL_CH4_CO2eq.find((p) => p.year === kyotoPoint.year)?.value ?? 0;
    const n2oValue = N2O_CO2eq[0].orderedPoints.find((p) => p.year === kyotoPoint.year)?.value ?? 0;

    return {
      year: kyotoPoint.year,
      value: Math.max(0, kyotoPoint.value - co2Value - ch4Value - n2oValue),
    };
  });

  const result: ShortRunReturn = {
    flagCategory: kyotoGases.runs[0].flagCategory,
    shortRuns: [
      createShortRun("Total Kyoto Gases", true, kyotoGases.runs[0].orderedPoints),
      createShortRun("CO2", false, CO2_CO2eq[0].orderedPoints),
      createShortRun("CH4", false, FINAL_CH4_CO2eq),
      createShortRun("N2O", false, N2O_CO2eq[0].orderedPoints),
      createShortRun(OTHER_GASES, false, otherGasesPoints),
    ],
  };

  return <KyotoGasesContent result={result} isSingleYear={isSingleYear} />;
}
