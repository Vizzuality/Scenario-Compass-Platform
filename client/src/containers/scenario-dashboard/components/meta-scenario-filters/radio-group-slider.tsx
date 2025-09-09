import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { selectTriggerVariants } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface SliderSelectItem {
  id: string;
  label: string;
}

export interface SliderSelectProps {
  items: SliderSelectItem[];
  placeholder?: string;
  defaultSelected?: string | null;
  defaultRange?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onSelectionChange?: (selectedId: string | null) => void;
  onRangeChange?: (range: [number, number]) => void;
  onApply?: (selectedId: string | null, rangeString: string) => void;
  className?: string;
  id?: string;
  currentValue: string[] | null;
}

const SliderSelect: React.FC<SliderSelectProps> = ({
  items,
  placeholder = "Select an option",
  defaultSelected = null,
  defaultRange = [20, 80],
  currentValue = null,
  min = 0,
  max = 100,
  step = 1,
  onSelectionChange,
  onRangeChange,
  onApply,
  className,
  id,
}) => {
  const parseCurrentValue = (): { selectedId: string | null; range: [number, number] } => {
    if (currentValue && currentValue.length === 2) {
      const [selectedId, rangeString] = currentValue;
      const rangeParts = rangeString.split("-");
      if (rangeParts.length === 2) {
        const min = parseInt(rangeParts[0], 10);
        const max = parseInt(rangeParts[1], 10);
        if (!isNaN(min) && !isNaN(max)) {
          return { selectedId, range: [min, max] };
        }
      }
    }
    return { selectedId: defaultSelected, range: defaultRange };
  };

  const { selectedId: initialSelectedId, range: initialRange } = parseCurrentValue();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(initialSelectedId);
  const [range, setRange] = useState<[number, number]>(initialRange);

  const handleSelectionChange = (itemId: string) => {
    setSelectedItem(itemId);
    onSelectionChange?.(itemId);
  };

  const handleRangeChange = (values: number[]) => {
    if (values.length === 2) {
      const newRange: [number, number] = [values[0], values[1]];
      setRange(newRange);
      onRangeChange?.(newRange);
    }
  };

  const selectedType = items.find((item) => item.id === selectedItem);
  const radioGroupName = `slider-select-${id || "default"}`;

  return (
    <div className="relative w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            className={cn(
              selectTriggerVariants({ theme: "light", size: "lg" }),
              "w-full",
              className,
            )}
            type="button"
          >
            <span className="text-gray-700">{selectedType?.label || placeholder}</span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
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
                  <input
                    type="radio"
                    id={item.id}
                    name={radioGroupName}
                    value={item.id}
                    checked={selectedItem === item.id}
                    onChange={(e) => {
                      handleSelectionChange(e.target.value);
                    }}
                    className="accent-primary mt-0.5 h-4 w-4"
                  />
                  <Label htmlFor={item.id} className="flex-1 cursor-pointer text-sm leading-5">
                    {item.label}
                  </Label>
                </div>

                {selectedItem === item.id && (
                  <div className="mt-3 px-2">
                    <div className="space-y-2">
                      <div className="text-center">
                        <span className="text-sm font-bold text-gray-900">
                          {range[0]}% - {range[1]}%
                        </span>
                      </div>

                      <Slider
                        value={range}
                        onValueChange={handleRangeChange}
                        max={max}
                        min={min}
                        step={step}
                        minStepsBetweenThumbs={1}
                        className="w-full"
                      />

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{min}%</span>
                        <span>{max}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t px-4 pt-2 pb-3">
            <Button
              className="w-full"
              onClick={() => {
                const rangeString = `${range[0]}-${range[1]}`;
                onApply?.(selectedItem, rangeString);
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SliderSelect;
