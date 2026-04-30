import { TreeNode } from "@/components/plots/components/variable-select/build-tree";
import { Variable } from "@iiasa/ixmp4-ts";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface TreeNodeComponentProps {
  node: TreeNode<Variable>;
  level?: number;
  selectedValue?: Variable["id"];
  onSelect: (value: Variable["id"]) => void;
  searchQuery?: string;
}

const containsSelectedValue = (
  node: TreeNode<Variable>,
  selectedValue: Variable["id"] | undefined,
): boolean => {
  if (selectedValue === undefined) return false;
  if (node.selectableItems.some((item) => item.id === selectedValue)) return true;
  return Object.values(node.children).some((child) => containsSelectedValue(child, selectedValue));
};

export const TreeNodeComponent = ({
  node,
  level = 0,
  selectedValue,
  onSelect,
  searchQuery = "",
}: TreeNodeComponentProps) => {
  const hasSelectedDescendant = useMemo(
    () => containsSelectedValue(node, selectedValue),
    [node, selectedValue],
  );

  const [isOpen, setIsOpen] = useState<boolean>(
    () => hasSelectedDescendant || searchQuery.length > 0,
  );

  React.useEffect(() => {
    if (searchQuery.length > 0) setIsOpen(true);
  }, [searchQuery]);

  const hasChildren = Object.keys(node.children).length > 0;
  const isSelectable = node.selectableItems.length > 0;
  const indent = level * 12;

  // Pure leaf — no children, directly selectable
  if (!hasChildren && isSelectable) {
    const variable = node.selectableItems[0];
    const isSelected = selectedValue === variable.id;
    return (
      <div
        className={cn(
          "hover:bg-accent flex cursor-pointer items-center gap-2 px-2 py-1.5",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft: `${indent + 24}px` }}
        onClick={() => onSelect(variable.id)}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(variable.id)}
          onClick={(e) => e.stopPropagation()}
          className={cn("shrink-0", !isSelected && "border-stone-400")}
        />
        <span className={cn("flex-1 text-sm", isSelected && "font-semibold")}>
          {variable.name.split("|").pop()?.trim()}
        </span>
      </div>
    );
  }

  // Branch node — has children, optionally selectable via header
  const variable = isSelectable ? node.selectableItems[0] : null;
  const isSelected = variable ? selectedValue === variable.id : false;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} data-path={node.path}>
      <div
        className={cn(
          "hover:bg-accent flex items-center gap-2 px-2 py-1.5",
          isSelected ? "bg-accent" : hasSelectedDescendant && "bg-accent/50",
        )}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        <CollapsibleTrigger asChild>
          <button className="flex flex-1 items-center gap-1 text-left text-sm font-medium">
            <ChevronRight
              className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-90")}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
            />
            {variable && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(variable.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(variable.id);
                }}
                className={cn("shrink-0", !isSelected && "border-stone-400")}
              />
            )}
            <span
              className={cn("flex", (isSelected || hasSelectedDescendant) && "font-semibold")}
              onClick={
                variable
                  ? (e) => {
                      e.stopPropagation();
                      onSelect(variable.id);
                    }
                  : undefined
              }
            >
              {node.name}
            </span>
            <span
              className="ml-1 rounded-full bg-black px-2 text-xs font-bold text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
            >
              {node.count - node.selectableItems.length}
            </span>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        {Object.values(node.children).map((childNode) => (
          <TreeNodeComponent
            key={childNode.path}
            node={childNode}
            level={level + 1}
            selectedValue={selectedValue}
            onSelect={onSelect}
            searchQuery={searchQuery}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
