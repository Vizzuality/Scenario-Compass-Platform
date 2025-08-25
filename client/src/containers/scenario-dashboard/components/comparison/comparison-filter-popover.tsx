import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  selectedFilters: string[];
  options: { label: string; value: string }[];
  onApply: (filters: string[]) => void;
}

export const ComparisonFilterPopover: React.FC<Props> = ({
  children,
  selectedFilters = [],
  options,
  onApply,
}) => {
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempFilters(selectedFilters);
    }
  };

  const toggleFilter = (filterValue: string) => {
    const isActive = tempFilters.includes(filterValue);
    const newFilters = isActive
      ? tempFilters.filter((f) => f !== filterValue)
      : [...tempFilters, filterValue];
    setTempFilters(newFilters);
  };

  const checkIfFilterIsActive = (filterValue: string) => {
    return tempFilters.includes(filterValue);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-3">
            {options.map((option) => {
              const id = `filter-${option.value}`;
              return (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={checkIfFilterIsActive(option.value)}
                    onCheckedChange={() => toggleFilter(option.value)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={id} className="cursor-pointer text-base font-medium">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>

          <PopoverClose asChild>
            <Button
              disabled={!tempFilters.length}
              onClick={() => onApply(tempFilters)}
              variant="outline"
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
