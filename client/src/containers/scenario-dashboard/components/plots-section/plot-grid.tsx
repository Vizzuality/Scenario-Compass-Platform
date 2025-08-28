import { MultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-runs-plot-widget";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface PlotsSectionProps {
  variables: readonly VARIABLE_TYPE[];
}

export function PlotGrid({ variables }: PlotsSectionProps) {
  const { year } = useScenarioDashboardUrlParams();
  const chartType = year ? PLOT_TYPE_OPTIONS.DOTS : PLOT_TYPE_OPTIONS.AREA;

  return (
    <div className="my-8 grid h-fit min-h-[600px] w-full grid-cols-2 grid-rows-2 gap-4">
      {variables.map((variable, index) => {
        return (
          <MultipleRunsPlotWidget variable={variable} key={index} initialChartType={chartType} />
        );
      })}
    </div>
  );
}
