import { VariablePlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

interface PlotsSectionProps {
  variables: readonly VARIABLE_TYPE[];
}

export function PlotGrid({ variables }: PlotsSectionProps) {
  return (
    <div className="my-8 grid h-fit w-full grid-cols-2 grid-rows-2 gap-4">
      <VariablePlotWidget variable={variables[0]} />
      <VariablePlotWidget variable={variables[1]} />
      <VariablePlotWidget variable={variables[2]} />
      <VariablePlotWidget variable={variables[3]} />
    </div>
  );
}
