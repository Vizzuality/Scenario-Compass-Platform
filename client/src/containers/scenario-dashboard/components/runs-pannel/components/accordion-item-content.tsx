import { AccordionContent } from "@/components/ui/accordion";
import { useMemo } from "react";
import { _getKeyCounts } from "@/containers/scenario-dashboard/utils/flags-utils";
import { RunCategory } from "@/containers/scenario-dashboard/components/runs-pannel/utils";

interface AccordionItemContentProps {
  category: RunCategory;
}

export const AccordionItemContent: React.FC<AccordionItemContentProps> = ({ category }) => {
  const keyCounts = useMemo(() => _getKeyCounts(category.runs), [category.runs]);

  return (
    <AccordionContent className="pt-2 pb-4">
      <div className="flex items-center justify-between text-xs text-stone-600">
        <p>Name</p>
        <p>Scenario runs</p>
      </div>
      <div className="space-y-2 divide-y">
        {keyCounts.map(([key, count]) => (
          <div key={key} className="flex items-center justify-between gap-2 py-1.5 text-sm">
            <div className="font-medium text-gray-800">{key}</div>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </AccordionContent>
  );
};
