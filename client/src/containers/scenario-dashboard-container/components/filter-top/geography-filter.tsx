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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { filterGeography } from "@/utils/flags-utils";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectGeography = (currentValue: string) => {
    setGeography(currentValue === geography ? "" : currentValue);
    setOpen(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const selectedName = geography
    ? geographyConfig.find((option) => option.id == geography)?.name
    : "Select geography...";

  // 1. Added a prop so we can control the list height independently
  const GeographyList = ({ listClassName = "max-h-[300px]" }: { listClassName?: string }) => (
    <Command filter={filterGeography}>
      <CommandInput placeholder="Search geography..." aria-label="Search for geography" />
      <CommandList
        className={cn("overflow-y-auto", listClassName)}
        onWheel={handleWheel}
        style={{ overscrollBehavior: "contain" }}
        role="listbox"
      >
        <CommandEmpty>No geography found.</CommandEmpty>
        <CommandGroup>
          {geographyConfig.map((option) => (
            <CommandItem
              key={option.id}
              value={option.id}
              id={option.id}
              keywords={[option.name]}
              onSelect={selectGeography}
              role="option"
              aria-selected={geography === option.id}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  geography === option.id ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
              {option.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <div className={cn(geographyFilterVariants({ variant }))}>
      <Label
        htmlFor="geography-combobox"
        className="text-beige-light text-base leading-6 font-bold"
      >
        Region
      </Label>

      {/* 2. Desktop View: Popover keeps the default max-h-[300px] */}
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              className="border-beige-light text-primary-foreground hover:text-primary-foreground w-full justify-between rounded-[4px] border bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-transparent"
              id="geography-combobox"
            >
              <span className="truncate">{selectedName}</span>
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <GeographyList />
          </PopoverContent>
        </Popover>
      ) : (
        /* 3. Mobile View: Drawer gets a taller max-height */
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              className="border-beige-light text-primary-foreground hover:text-primary-foreground w-full justify-between rounded-[4px] border bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-transparent"
              id="geography-combobox"
            >
              <span className="truncate">{selectedName}</span>
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 p-0 pb-8">
              <GeographyList listClassName="max-h-[60vh]" />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
