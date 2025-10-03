import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useState } from "react";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import {
  ScenarioFlagsErrorState,
  ScenarioFlagsLoadingState,
} from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/scenario-flags-states";
import {
  SCENARIO_FLAGS_ACCORDION_VALUE,
  SharedScenarioFlagsContent,
} from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/common-content";

interface Props {
  result: RunPipelineReturn;
  prefix?: string;
  initialOpen?: boolean;
}

export default function MultiRunScenarioFlags({ result, prefix, initialOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen ? SCENARIO_FLAGS_ACCORDION_VALUE : undefined);

  if (result.isLoading) return <ScenarioFlagsLoadingState />;
  if (result.isError) return <ScenarioFlagsErrorState />;

  const isAccordionOpen = isOpen === SCENARIO_FLAGS_ACCORDION_VALUE;

  return (
    <Accordion value={isOpen} onValueChange={setIsOpen} type="single" collapsible>
      <AccordionItem
        value={SCENARIO_FLAGS_ACCORDION_VALUE}
        className={isAccordionOpen ? "border-b-0" : ""}
      >
        <SharedScenarioFlagsContent
          result={result}
          prefix={prefix}
          isOpen={isAccordionOpen}
          showDetailsWhenClosed={initialOpen !== undefined}
        />
      </AccordionItem>
    </Accordion>
  );
}
