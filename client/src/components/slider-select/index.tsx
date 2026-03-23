import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RangeSlider from "@/components/slider-select/range-slider";
import { cn } from "@/lib/utils";
import { selectTriggerVariants } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

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
  const [checkedIds, setCheckedIds] = useState<Array<string>>([]);
  const [changes, setChanges] = useState<ChangeStateAction>({});
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
      [id]: [values[0], values[1]],
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
      const newItem = items.find((item) => item.id === id);
      if (!newItem) return null;
      setCheckedIds((prevState) => [...prevState, id]);
      setChanges((prevState) => ({
        ...prevState,
        [id]: [newItem.defaultRange[0], newItem.defaultRange[1]],
      }));
    }
  };

  const handleApply = () => {
    onApply(changes);
    setOpen(false); // Closes either the Popover or Drawer programmatically
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

  // Reusable trigger button to keep code clean
  const TriggerButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >(({ className: buttonClassName, ...props }, ref) => (
    <button
      ref={ref}
      id={id}
      className={cn(
        selectTriggerVariants({ theme: "light", size: "lg" }),
        "hover:bg-hover-secondary w-full",
        buttonClassName,
        className,
      )}
      {...props}
    >
      <span className="text-gray-700">{getText()}</span>
      <ChevronDown
        className={cn(
          "h-5 w-5 text-gray-400 transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </button>
  ));
  TriggerButton.displayName = "TriggerButton";

  // Reusable content logic so we don't map over items twice
  const FilterContent = ({ listClassName }: { listClassName?: string }) => (
    <>
      <div className={cn("divide-y divide-gray-200 py-2", listClassName)}>
        {items.map((item) => {
          const config = getItemConfig(item);
          return (
            <div key={item.id} className="px-4 py-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  disabled={checkIfCheckboxDisabled(config)}
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
                  max={config.max}
                  min={config.min}
                  step={config.step}
                  range={getRangeValue(item)}
                  type={type}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t px-4 pt-2 pb-3">
        <Button className="w-full" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </>
  );

  return (
    <div className="relative w-full">
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <TriggerButton />
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] min-w-100 p-0"
            align="start"
          >
            <FilterContent />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <TriggerButton />
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 p-0 pb-8">
              <FilterContent listClassName="max-h-[60vh] overflow-y-auto" />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default SliderSelect;
