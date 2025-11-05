import { PlotContainer, PlotWidgetHeader } from "@/components/plots/components";
import { useGetSingleRunForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-single-run-for-variable-pipeline";
import LoadingDots from "@/components/animations/loading-dots";
import React, { useEffect } from "react";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { ShortRun, ShortRunReturn } from "@/components/plots/plot-variations/custom/kyoto/types";
import { getFinalCH4Points } from "@/components/plots/plot-variations/custom/kyoto/utils";
import CustomPlotLegend from "@/components/plots/plot-variations/custom/kyoto/custom-plot-legend";
import { usePlotContainer } from "@/hooks/plots/plot-container/use-plot-container";
import { renderKyotoPlot } from "@/components/plots/plot-variations/custom/kyoto/render";
import * as d3 from "d3";
import { ExtendedRun, ShortDataPoint } from "@/types/data/run";
import { OTHER_GASES } from "@/lib/config/plots/plots-constants";

const GWP_CH4 = 25;
const GWP_N2O_WITH_UNIT_CONVERSION = 0.298;

/**
 * Converts greenhouse gases to common unit: Mt CO2 equivalent per year
 *
 * Input units:
 * - Kyoto gases: Mt CO2eq/year (already converted)
 * - CO2: Mt CO2/year → Mt CO2eq/year (GWP = 1)
 * - CH4 (AFOLU): Mt CH4/year → Mt CO2eq/year (GWP = 25)
 * - CH4 (Energy): Mt CH4/year → Mt CO2eq/year (GWP = 25)
 * - N2O: kt N2O/year → Mt CO2eq/year (GWP = 298, kt to Mt = ÷1000)
 */
export function KyotoGasesPlot() {
  const kyotoGases = useGetSingleRunForVariablePipeline({
    variable: "Emissions|Kyoto Gases",
  });
  const CO2 = useGetSingleRunForVariablePipeline({ variable: "Emissions|CO2" });
  const CH4_AFOLU = useGetSingleRunForVariablePipeline({ variable: "Emissions|CH4|AFOLU" });
  const CH4_ENERGY = useGetSingleRunForVariablePipeline({
    variable: "Emissions|CH4|Energy",
  });
  const N2O = useGetSingleRunForVariablePipeline({ variable: "Emissions|N2O" });

  const isError = [kyotoGases, CO2, CH4_AFOLU, CH4_ENERGY, N2O].some(
    (pipeline) => pipeline.isError,
  );
  const isLoading = [kyotoGases, CO2, CH4_AFOLU, CH4_ENERGY, N2O].some(
    (pipeline) => pipeline.isLoading,
  );

  const renderStateComponent = (content: React.ReactNode) => (
    <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader title="GHG Emissions" />
      <PlotContainer>{content}</PlotContainer>
    </div>
  );

  if (isLoading) return renderStateComponent(<LoadingDots />);
  if (isError) return renderStateComponent(<DataFetchError />);

  const convertGasToMtCO2eq = (runs: ExtendedRun[], multiplier: number) => {
    const converted = structuredClone(runs);
    converted.forEach((run) => {
      run.orderedPoints.forEach((point) => {
        point.value *= multiplier;
      });
    });
    return converted;
  };

  // Convert gases to Mt CO2eq/year
  const CH4_AFOLU_CO2eq = convertGasToMtCO2eq(CH4_AFOLU.runs, GWP_CH4);
  const CH4_ENERGY_CO2eq = convertGasToMtCO2eq(CH4_ENERGY.runs, GWP_CH4);
  const N2O_CO2eq = convertGasToMtCO2eq(N2O.runs, GWP_N2O_WITH_UNIT_CONVERSION);
  const CO2_CO2eq = structuredClone(CO2.runs);

  // Combine CH4 sources
  const FINAL_CH4_CO2eq = getFinalCH4Points(
    CH4_ENERGY_CO2eq[0].orderedPoints,
    CH4_AFOLU_CO2eq[0].orderedPoints,
  );

  // Calculate Other Gases (Kyoto - CO2 - CH4 - N2O)
  const otherGasesPoints: ShortDataPoint[] = kyotoGases.runs[0].orderedPoints.map((kyotoPoint) => {
    const co2Point = CO2_CO2eq[0].orderedPoints.find((p) => p.year === kyotoPoint.year);
    const ch4Point = FINAL_CH4_CO2eq.find((p) => p.year === kyotoPoint.year);
    const n2oPoint = N2O_CO2eq[0].orderedPoints.find((p) => p.year === kyotoPoint.year);

    const co2Value = co2Point?.value || 0;
    const ch4Value = ch4Point?.value || 0;
    const n2oValue = n2oPoint?.value || 0;

    const otherGasesValue = kyotoPoint.value - co2Value - ch4Value - n2oValue;

    return {
      year: kyotoPoint.year,
      value: Math.max(0, otherGasesValue),
    };
  });

  const createShortRun = (
    variableName: string,
    isLine: boolean,
    orderedPoints: ShortDataPoint[],
  ): ShortRun => ({
    variableName,
    isLine,
    orderedPoints,
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

  const variables = [OTHER_GASES, "N2O", "CH4", "CO2"];

  return (
    <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader title="GHG Emissions" />
      <CustomPlotLegend flagCategory={result.flagCategory} variables={variables} />
      <PlotContainer>
        <KyotoBasePlot data={result} />
      </PlotContainer>
    </div>
  );
}

const KyotoBasePlot = ({ data }: { data: ShortRunReturn }) => {
  const { svgRef, dimensions, plotContainer } = usePlotContainer();

  useEffect(() => {
    if (!data?.shortRuns?.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    renderKyotoPlot({ svg, dimensions, data });
  }, [data, dimensions, svgRef]);

  return plotContainer;
};
