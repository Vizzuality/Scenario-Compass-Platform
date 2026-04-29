"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Variable } from "@iiasa/ixmp4-ts";
import LoadingDots from "@/components/animations/loading-dots";
import { buildTree, TreeLevel } from "@/components/plots/components/variable-select/build-tree";
import { TreeNodeComponent } from "@/components/plots/components/variable-select/tree-node";
import { Accordion } from "@/components/ui/accordion";
import { filterTree } from "@/components/plots/components/variable-select/utils";

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
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (currentValue: Variable["id"]) => {
    if (currentValue !== value) {
      onSelectAction(currentValue);
    }
    setOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearchQuery("");
  };

  const variablesTree = React.useMemo(() => {
    if (!options) return {};
    return buildTree<Variable>(options);
  }, [options]);

  const filteredTree = React.useMemo(() => {
    return filterTree(variablesTree, searchQuery);
  }, [variablesTree, searchQuery]);

  const totalMatches = React.useMemo(() => {
    let count = 0;
    const countNodes = (tree: TreeLevel<Variable>) => {
      Object.values(tree).forEach((node) => {
        count += node.selectableItems.length;
        countNodes(node.children);
      });
    };
    countNodes(filteredTree);
    return count;
  }, [filteredTree]);

  const selectedLabel = value ? options?.find((v) => v.id === value)?.name : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className="w-64 justify-between border-1 border-stone-300 font-normal"
        >
          <p className="truncate text-sm">{selectedLabel ?? "Select variable..."}</p>
          <ChevronsUpDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-92 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search variable..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isError ? (
              <CommandEmpty>Unable to load data.</CommandEmpty>
            ) : isLoading ? (
              <CommandEmpty className="flex min-h-40 flex-col items-center justify-center gap-4 p-4">
                <LoadingDots />
                <p>Loading variables</p>
              </CommandEmpty>
            ) : Object.keys(filteredTree).length === 0 ? (
              <CommandEmpty>
                {searchQuery ? `No results found for "${searchQuery}"` : "No variables available"}
              </CommandEmpty>
            ) : (
              <>
                {searchQuery && (
                  <div className="text-muted-foreground border-b px-2 py-1.5 text-xs">
                    {totalMatches} result{totalMatches !== 1 ? "s" : ""} found
                  </div>
                )}
                <Accordion type="single" collapsible className="w-full">
                  {Object.values(filteredTree).map((node) => (
                    <TreeNodeComponent
                      key={node.path}
                      node={node}
                      level={0}
                      selectedValue={value}
                      onSelect={handleSelect}
                      searchQuery={searchQuery}
                    />
                  ))}
                </Accordion>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
