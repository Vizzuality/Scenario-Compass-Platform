import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import {
  SCENARIO_FLAGS_ACCORDION_VALUE,
  SharedScenarioFlagsContent,
} from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/common-content";
import {
  ScenarioFlagsErrorState,
  ScenarioFlagsLoadingState,
} from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flags-states";

interface ControlledMultiRunScenarioFlagsProps {
  result: RunPipelineReturn;
  prefix?: string;
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}

export default function ControlledMultiRunScenarioFlags({
  result,
  prefix,
  value,
  onValueChange,
}: ControlledMultiRunScenarioFlagsProps) {
  if (result.isLoading) return <ScenarioFlagsLoadingState />;
  if (result.isError) return <ScenarioFlagsErrorState />;

  const isOpen = value === SCENARIO_FLAGS_ACCORDION_VALUE;

  return (
    <Accordion value={value} onValueChange={onValueChange} type="single" collapsible>
      <AccordionItem value={SCENARIO_FLAGS_ACCORDION_VALUE} className={isOpen ? "border-b-0" : ""}>
        <SharedScenarioFlagsContent
          result={result}
          prefix={prefix}
          isOpen={isOpen}
          showDetailsWhenClosed
        />
      </AccordionItem>
    </Accordion>
  );
}
