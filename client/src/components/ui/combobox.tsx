"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useId } from "react";

export const comboboxFilterVariants = cva("flex flex-1 flex-col gap-2", {
  variants: {
    variant: {
      light: "",
      dark: "[&_label]:text-stone-950 [&_button]:border-border [&_button]:text-foreground [&_button]:bg-transparent",
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

export interface Option {
  value: string;
  label: string;
}

interface ComboboxFilterProps extends VariantProps<typeof comboboxFilterVariants> {
  label: string;
  placeholder?: string;
  options: Option[] | undefined;
  value: string;
  onChange: (value: string) => void;
  filterFunction?: (value: string, search: string, keywords?: string[]) => number;
  id?: string;
  isLoading?: boolean;
}

export function ComboboxFilter({
  label,
  placeholder = "Search...",
  options,
  value,
  onChange,
  filterFunction,
  variant,
  isLoading = false,
}: ComboboxFilterProps) {
  const [open, setOpen] = React.useState(false);
  const comboboxId = useId();

  const isLoadingOrEmpty = isLoading || !options || options.length === 0;

  const selectOption = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const getButtonText = () => {
    if (isLoading) return "Loading data...";
    if (!options || options.length === 0) return placeholder;
    if (value) return options.find((option) => option.value === value)?.label;
    return placeholder;
  };

  return (
    <div className={cn(comboboxFilterVariants({ variant }))}>
      <Label htmlFor={comboboxId} className="text-beige-light text-base leading-6 font-bold">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className="text-primary-foreground w-full justify-between rounded-[4px] border-1 border-stone-300 bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-transparent"
            id={comboboxId}
            disabled={isLoadingOrEmpty}
          >
            {getButtonText()}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command filter={filterFunction}>
            <CommandInput placeholder={placeholder} aria-label={`Search for ${label}`} />
            <CommandList
              className="max-h-[300px] overflow-y-auto"
              onWheel={handleWheel}
              style={{ overscrollBehavior: "contain" }}
              role="listbox"
            >
              {isLoading ? (
                <CommandEmpty>Loading data...</CommandEmpty>
              ) : (
                <>
                  <CommandGroup>
                    {options?.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        keywords={[option.label]}
                        onSelect={selectOption}
                        role="option"
                        aria-selected={value === option.value}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0",
                          )}
                          aria-hidden="true"
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
