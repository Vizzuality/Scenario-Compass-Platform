import { VariablePlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget";
import ScenarioFlags from "@/containers/scenario-dashboard/components/compare-scenarios-mock";
import { useFilterPointsPipeline } from "@/hooks/use-filter-points-pipeline";

interface PlotsSectionProps {
  variables: readonly string[];
}

export function PlotGrid({ variables }: PlotsSectionProps) {
  const dp1 = useFilterPointsPipeline(variables[0]);
  const dp2 = useFilterPointsPipeline(variables[1]);
  const dp3 = useFilterPointsPipeline(variables[2]);
  const dp4 = useFilterPointsPipeline(variables[3]);

  const allDataPoints = [...dp1, ...dp2, ...dp3, ...dp4];

  return (
    <div className="container mx-auto flex gap-20">
      <div className="my-8 grid w-full grid-cols-2 grid-rows-2 gap-4">
        <VariablePlotWidget dataPoints={dp1} variable={variables[0]} />
        <VariablePlotWidget dataPoints={dp2} variable={variables[1]} />
        <VariablePlotWidget dataPoints={dp3} variable={variables[2]} />
        <VariablePlotWidget dataPoints={dp4} variable={variables[3]} />
      </div>
      <ScenarioFlags dataPoints={allDataPoints} />
    </div>
  );
}
