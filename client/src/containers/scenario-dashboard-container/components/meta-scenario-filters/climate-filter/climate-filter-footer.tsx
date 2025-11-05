import { Button } from "@/components/ui/button";

export const ClimateFilterFooter = ({
  clearAll,
  applyChanges,
}: {
  clearAll: () => void;
  applyChanges: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 border-t p-3">
      <Button variant="ghost" onClick={clearAll} className="w-full flex-1/2 px-3">
        Clear
      </Button>
      <Button onClick={applyChanges} className="w-full flex-1/2 px-3">
        Apply
      </Button>
    </div>
  );
};
