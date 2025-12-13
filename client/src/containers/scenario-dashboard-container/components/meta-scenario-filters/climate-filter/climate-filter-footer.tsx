import { Button } from "@/components/ui/button";

export const ClimateFilterFooter = ({
  clearAll,
  applyChanges,
  hasChanges,
}: {
  clearAll: () => void;
  applyChanges: () => void;
  hasChanges: () => boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 border-t p-3">
      <Button variant="ghost" onClick={clearAll} className="w-full flex-1/2 px-3">
        Clear
      </Button>
      <Button disabled={!hasChanges()} onClick={applyChanges} className="w-full flex-1/2 px-3">
        Apply
      </Button>
    </div>
  );
};
