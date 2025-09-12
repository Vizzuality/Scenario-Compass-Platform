"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Variable } from "@iiasa/ixmp4-ts";
import LoadingDots from "@/components/animations/loading-dots";

interface Props {
  isLoading?: boolean;
  isError?: boolean;
  options: Variable[] | undefined;
  onSelectAction: (variableId: Variable["id"]) => void;
  value?: Variable["id"];
}

export function ComboboxVariableSelect({
  options,
  onSelectAction,
  value,
  isError,
  isLoading,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    const numericValue = Number(currentValue);
    const isSameValue = numericValue === value;
    if (!isSameValue) {
      onSelectAction(numericValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between border-1 border-stone-300 font-normal"
        >
          <p className="truncate">
            {value
              ? options?.find((variable) => variable.id === value)?.name
              : "Select variable..."}
          </p>
          <ChevronsUpDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-64 p-0">
        <Command>
          <CommandInput placeholder="Search variable..." className="h-9" />
          <CommandList>
            {isError ? (
              <CommandEmpty>Unable to load data.</CommandEmpty>
            ) : isLoading ? (
              <CommandEmpty className="flex min-h-40 flex-col items-center justify-center gap-4 p-4">
                <LoadingDots />
                <p>Loading variables</p>
              </CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No results available.</CommandEmpty>
                <CommandGroup>
                  {options?.map((variable) => (
                    <CommandItem
                      key={variable.id}
                      value={variable.id.toString()}
                      keywords={[variable.name]}
                      onSelect={handleSelect}
                    >
                      {variable.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === variable.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
