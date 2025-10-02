import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RangeSlider from "@/containers/scenario-dashboard/components/slider-select/range-slider";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

export interface SliderSelectItem {
  id: string;
  label: string;
  value: [number, number] | null;
  defaultRange: [number, number];
}

export interface SliderSelectProps {
  items: SliderSelectItem[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  onApply: (selections: ChangeStateAction) => void;
  className?: string;
  id: string;
}

export type ChangeStateAction = Record<string, [number, number] | null>;

const SliderSelect: React.FC<SliderSelectProps> = ({
  items,
  placeholder = "Select options",
  min = 0,
  max = 100,
  step = 1,
  className,
  onApply,
  id,
}) => {
  const [checkedIds, setCheckedIds] = useState<Array<string>>([]);
  const [changes, setChanges] = useState<ChangeStateAction>({});

  useEffect(() => {
    const getCheckedIds = () => {
      return items.filter((item) => item.value !== null).map((item) => item.id);
    };

    setCheckedIds(getCheckedIds());
  }, [items]);

  const getText = () => {
    const selectedCount = items.filter((item) => item.value).length;

    if (!selectedCount) return placeholder;
    else return `${selectedCount} Selected`;
  };

  const handleRangeChange = (values: number[], id: string) => {
    if (values.length !== 2) {
      console.error("Expected exactly 2 values for range");
      return;
    }

    setChanges((prevState) => ({
      ...prevState,
      [id]: [values[0], values[1]] as [number, number],
    }));
  };

  const isItemChecked = (id: string) => {
    return checkedIds.includes(id);
  };

  const handleItemCheck = (id: string) => {
    if (isItemChecked(id)) {
      setCheckedIds((prevState) => prevState.filter((checkedId) => checkedId !== id));
      setChanges((prevState) => ({
        ...prevState,
        [id]: null,
      }));
    } else {
      setCheckedIds((prevState) => [...prevState, id]);
    }
  };

  const handleApply = () => {
    onApply(changes);
  };

  const getRangeValue = (item: SliderSelectItem): [number, number] => {
    const change = changes[item.id];
    if (change !== undefined && change !== null) return change;
    if (item.value) return item.value;
    return item.defaultRange;
  };

  return (
    <div className="relative w-full">
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            className={cn(
              selectTriggerVariants({ theme: "light", size: "lg" }),
              "hover:bg-hover-secondary w-full",
              className,
            )}
          >
            <span className="text-gray-700">{getText()}</span>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-100 p-0"
          align="start"
        >
          <div className="divide-y divide-gray-200 py-2">
            {items.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={item.id}
                    checked={isItemChecked(item.id)}
                    onCheckedChange={() => handleItemCheck(item.id)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={item.id} className="flex-1 cursor-pointer text-sm leading-5">
                    {item.label}
                  </Label>
                </div>

                {isItemChecked(item.id) && (
                  <RangeSlider
                    handleRangeChange={(values) => handleRangeChange(values, item.id)}
                    max={max}
                    min={min}
                    step={step}
                    range={getRangeValue(item)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="border-t px-4 pt-2 pb-3">
            <PopoverClose asChild>
              <Button className="w-full" onClick={handleApply}>
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SliderSelect;
