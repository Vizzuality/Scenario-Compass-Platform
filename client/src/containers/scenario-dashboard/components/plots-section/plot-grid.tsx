import { MultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-runs-plot-widget";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

interface PlotsSectionProps {
  variables: readonly VARIABLE_TYPE[];
}

export function PlotGrid({ variables }: PlotsSectionProps) {
  return (
    <div className="my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
      <MultipleRunsPlotWidget variable={variables[0]} />
      <MultipleRunsPlotWidget variable={variables[1]} />
      <MultipleRunsPlotWidget variable={variables[2]} />
      <MultipleRunsPlotWidget variable={variables[3]} />
    </div>
  );
}
