import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";

export function VettingToggle({ prefix = "" }: { prefix?: string }) {
  const { showVetting, setShowVetting } = useScenarioFlagsSelection(prefix);

  return (
    <div className="mt-4 mb-1 flex flex-col gap-3">
      <strong className="border-b pb-1 text-base text-stone-800">
        Validation against historical and current trends
      </strong>
      <div className="flex items-start space-x-2">
        <Switch id="show-vetting" checked={showVetting} onCheckedChange={setShowVetting} />
        <Label htmlFor="show-vetting">
          Scenarios that are not in line with historical reference data for energy and emissions or
          that are not aligned with current trends in 2025.
        </Label>
      </div>
    </div>
  );
}
