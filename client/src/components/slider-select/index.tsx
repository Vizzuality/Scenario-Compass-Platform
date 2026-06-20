import React, { memo, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RangeSlider from "@/components/slider-select/range-slider";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

export interface SliderSelectItem {
  id: string;
  label: string;
  value: [number, number] | null;
  defaultRange: [number, number];
  min?: number;
  max?: number;
  step?: number;
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
  type?: "percentual" | "range";
}

export type ChangeStateAction = Record<string, [number, number] | null>;

const SliderRow = memo(function SliderRow({
  item,
  config,
  checked,
  disabled,
  type,
  rangeValue,
  onCheck,
  onRangeChange,
}: {
  item: SliderSelectItem;
  config: { min: number; max: number; step: number };
  checked: boolean;
  disabled: boolean;
  type: "percentual" | "range";
  rangeValue: [number, number];
  onCheck: (id: string) => void;
  onRangeChange: (id: string, value: [number, number]) => void;
}) {
  const [liveRange, setLiveRange] = useState<[number, number]>(rangeValue);

  useEffect(() => {
    setLiveRange(rangeValue);
  }, [rangeValue]);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={item.id}
          disabled={disabled}
          checked={checked}
          onCheckedChange={() => onCheck(item.id)}
          className="mt-0.5"
        />

        <Label htmlFor={item.id} className="flex-1 cursor-pointer text-sm leading-5">
          {item.label}
        </Label>
      </div>

      {checked && (
        <RangeSlider
          handleRangeChange={(values) => {
            if (values.length !== 2) {
              console.error("Expected exactly 2 values for range");
              return;
            }

            const nextRange: [number, number] = [values[0], values[1]];

            setLiveRange(nextRange);
            onRangeChange(item.id, nextRange);
          }}
          max={config.max}
          min={config.min}
          step={config.step}
          range={liveRange}
          type={type}
        />
      )}
    </div>
  );
});

const SliderSelect: React.FC<SliderSelectProps> = ({
  items,
  placeholder = "Select options",
  min = 0,
  max = 100,
  step = 1,
  className,
  onApply,
  id,
  type = "percentual",
}) => {
  const [changes, setChanges] = useState<ChangeStateAction>({});

  const getText = () => {
    const selectedCount = items.filter((item) => item.value).length;

    if (!selectedCount) return placeholder;
    else return `${selectedCount} Selected`;
  };

  const handleRangeChange = (id: string, value: [number, number]) => {
    setChanges((prevState) => ({ ...prevState, [id]: value }));
  };

  const isItemChecked = (id: string) => {
    const change = changes[id];
    if (change !== undefined) return change !== null;

    const item = items.find((candidate) => candidate.id === id);
    return item?.value !== null;
  };

  const handleItemCheck = (id: string) => {
    // If item already checked, remove the selection
    if (isItemChecked(id)) {
      setChanges((prevState) => ({ ...prevState, [id]: null }));
    } else {
      // If item not already checked, add by default the default values
      const newItem = items.find((item) => item.id === id);
      if (!newItem) return null;

      setChanges((prevState) => ({
        ...prevState,
        [id]: [newItem.defaultRange[0], newItem.defaultRange[1]],
      }));
    }
  };

  const handleApply = () => {
    onApply({ ...changes });
  };

  const getRangeValue = (item: SliderSelectItem): [number, number] => {
    const change = changes[item.id];

    if (change !== undefined && change !== null) return change;
    if (item.value) return item.value;

    return item.defaultRange;
  };

  const getItemConfig = (item: SliderSelectItem) => ({
    min: item.min ?? min,
    max: item.max ?? max,
    step: item.step ?? step,
  });

  const checkIfCheckboxDisabled = (config: ReturnType<typeof getItemConfig>) => {
    const isMinValid =
      config.min !== Number.MAX_SAFE_INTEGER &&
      config.min !== Infinity &&
      !Number.isNaN(config.min);

    const isMaxValid =
      config.max !== Number.MIN_SAFE_INTEGER &&
      config.max !== -Infinity &&
      !Number.isNaN(config.max);

    const hasValidRange = isMinValid && isMaxValid && config.min < config.max;

    return !hasValidRange;
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
            {items.map((item) => {
              const config = getItemConfig(item);

              return (
                <SliderRow
                  key={item.id}
                  item={item}
                  config={config}
                  checked={isItemChecked(item.id)}
                  disabled={checkIfCheckboxDisabled(config)}
                  type={type}
                  rangeValue={getRangeValue(item)}
                  onCheck={handleItemCheck}
                  onRangeChange={handleRangeChange}
                />
              );
            })}
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
