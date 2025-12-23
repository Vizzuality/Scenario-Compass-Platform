import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItemContent } from "@/containers/scenario-dashboard-container/components/runs-pannel/components/accordion-item-content";
import { BaseFlagTrigger } from "@/containers/scenario-dashboard-container/components/runs-pannel/scenario-flags/scenario-flag-trigger";
import { RunPipelineReturn } from "@/types/data/run";
import { ColoredScenarioBar } from "@/containers/scenario-dashboard-container/components/runs-pannel/scenario-flags/colored-scenario-bar";
import { useScenarioFlagsData } from "@/hooks/nuqs/flags/use-scenario-flags-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";

export const SCENARIO_FLAGS_ACCORDION_VALUE = "scenario-flags";

interface SharedContentProps {
  result: RunPipelineReturn;
  prefix?: string;
}

export function SharedScenarioFlagsContent({ result, prefix }: SharedContentProps) {
  const { showVetting, setShowVetting } = useScenarioFlagsSelection(prefix);

  const visibleRuns = filterVisibleRuns(result.runs, [], showVetting);

  const { totalCountOfUniqueRuns, categories, highCategories, mediumCategories, okCategories } =
    useScenarioFlagsData(visibleRuns);

  return (
    <>
      <AccordionTrigger className="pt-0 pb-1.5 text-base font-bold text-stone-800">
        <div className="flex items-center gap-4">
          <p className="text-base">Feasibility and Sustainability Criteria</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-3 border-t pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex">
            <div className="flex">
              <p>Classification of selected scenarios by reasons for concern</p>
            </div>
          </div>
          <ColoredScenarioBar
            categories={categories}
            totalRuns={totalCountOfUniqueRuns}
            prefix={prefix}
          />
        </div>
        <div className="flex flex-col gap-5">
          {okCategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <strong className="text-foreground text-xs">NO REASONS FOR CONCERN</strong>
              <Accordion type="single" collapsible className="w-full">
                {okCategories.map(([key, category]) => (
                  <AccordionItem key={key} value={key}>
                    <BaseFlagTrigger
                      className="pb-2"
                      categoryKey={key}
                      category={category}
                      prefix={prefix}
                      showChevron
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          {mediumCategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <strong className="text-foreground text-xs">MEDIUM</strong>
              <Accordion type="single" collapsible className="w-full">
                {mediumCategories.map(([key, category]) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="[&_svg]:text-foreground flex w-full items-start px-0 py-2">
                      <BaseFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                    </AccordionTrigger>
                    <AccordionItemContent categorySummary={category} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          {highCategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <strong className="text-foreground text-xs">HIGH</strong>
              <Accordion type="single" collapsible className="w-full">
                {highCategories.map(([key, category]) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="[&_svg]:text-foreground flex w-full items-start px-0 py-2">
                      <BaseFlagTrigger categoryKey={key} category={category} prefix={prefix} />
                    </AccordionTrigger>
                    <AccordionItemContent categorySummary={category} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          <div className="mt-4 mb-1 flex flex-col gap-3">
            <strong className="border-b pb-1 text-base text-stone-800">
              Validation against historical and current trends
            </strong>
            <div className="flex items-start space-x-2">
              <Switch id="show-vetting" checked={showVetting} onCheckedChange={setShowVetting} />
              <Label htmlFor="show-vetting">
                Scenarios that are not in line with historical reference data for energy and
                emissions or that are not aligned with current trends in 2025.
              </Label>
            </div>
          </div>
        </div>
      </AccordionContent>
    </>
  );
}
