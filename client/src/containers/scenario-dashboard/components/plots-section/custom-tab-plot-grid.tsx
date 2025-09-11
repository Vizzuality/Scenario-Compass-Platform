import { useState } from "react";
import { NUMBER_OF_PLOTS_PER_TAB } from "@/lib/config/tabs/tabs-config";
import { CustomMultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/custom-multiple-runs-plot-widget";
import { ChartType } from "@/components/plots/components/chart-type-toggle";

interface Props {
  initialChartType: ChartType;
  className?: string;
  prefix?: string;
}

export default function CustomTabPlotGrid({ initialChartType, className, prefix }: Props) {
  const [lastInteractedIndex, setLastInteractedIndex] = useState<number>(-1);

  const checkIfIndexIsActive = (index: number) => {
    if (lastInteractedIndex === -1) {
      return index === 0;
    }

    const enabledCount = lastInteractedIndex + 2;
    return index < enabledCount && index < NUMBER_OF_PLOTS_PER_TAB;
  };

  const handleVariableSelect = (index: number) => {
    setLastInteractedIndex(index);
  };

  return (
    <div className={className}>
      {Array(NUMBER_OF_PLOTS_PER_TAB)
        .fill(null)
        .map((_, index) => (
          <CustomMultipleRunsPlotWidget
            isEnabled={checkIfIndexIsActive(index)}
            key={index}
            index={index}
            prefix={prefix}
            onVariableSelect={() => handleVariableSelect(index)}
            initialChartType={initialChartType}
          />
        ))}
    </div>
  );
}
