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
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { filterGeography } from "@/containers/scenario-dashboard/utils";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

const geographyFilterVariants = cva("flex flex-1 flex-col gap-2", {
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

type Props = VariantProps<typeof geographyFilterVariants>;

export default function GeographyFilter({ variant }: Props) {
  const { geography, setGeography } = useBaseUrlParams();
  const [open, setOpen] = React.useState(false);

  const selectGeography = (currentValue: string) => {
    setGeography(currentValue === geography ? "" : currentValue);
    setOpen(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={cn(geographyFilterVariants({ variant }))}>
      <Label
        htmlFor="geography-combobox"
        className="text-beige-light text-base leading-6 font-bold"
      >
        Geography
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className="border-beige-light text-primary-foreground w-full justify-between rounded-[4px] border-1 bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-transparent"
            id="geography-combobox"
          >
            {geography
              ? geographyConfig.find((option) => option.value === geography)?.label
              : "Select geography..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command filter={filterGeography}>
            <CommandInput placeholder="Search geography..." aria-label="Search for geography" />
            <CommandList
              className="max-h-[300px] overflow-y-auto"
              onWheel={handleWheel}
              style={{ overscrollBehavior: "contain" }}
              role="listbox"
            >
              <CommandEmpty>No geography found.</CommandEmpty>
              <CommandGroup>
                {geographyConfig.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={selectGeography}
                    role="option"
                    aria-selected={geography === option.value}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        geography === option.value ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
