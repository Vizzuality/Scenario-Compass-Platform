import { TreeNode } from "@/components/plots/components/variable-select/build-tree";
import { Variable } from "@iiasa/ixmp4-ts";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const hasSelectableItemsAtCurrentLevel = node.selectableItems.length > 0;
  const hasChildren = Object.keys(node.children).length > 0;
  const indent = level * 12;

  const content = (
    <div className="w-full">
      <div
        className={cn(
          "hover:bg-accent flex items-center gap-2 px-2 py-1.5",
          hasSelectedDescendant && "bg-accent/50",
        )}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        {(hasChildren || hasSelectableItemsAtCurrentLevel) && (
          <CollapsibleTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
            <button className="flex flex-1 items-center gap-1 text-left text-sm font-medium">
              <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
              <span className={cn(hasSelectedDescendant && "font-semibold")}>{node.name}</span>
              <span className="ml-1 rounded-full bg-black px-2 text-xs font-bold text-white">
                {node.count}
              </span>
            </button>
          </CollapsibleTrigger>
        )}

        {!hasChildren && !hasSelectableItemsAtCurrentLevel && (
          <span className="flex-1 text-sm font-medium">{node.name}</span>
        )}
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

        {hasSelectableItemsAtCurrentLevel &&
          node.selectableItems.map((variable) => {
            const isSelected = selectedValue === variable.id;
            return (
              <div
                key={variable.id}
                className={cn(
                  "hover:bg-accent flex cursor-pointer items-center gap-2 px-2 py-1.5",
                  isSelected && "bg-accent",
                )}
                style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                onClick={() => onSelect(variable.id)}
              >
                <span className={cn("flex-1 text-sm", isSelected && "font-semibold")}>
                  {variable.name.split("|").pop()?.trim()}
                </span>
                <Check
                  className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                />
              </div>
            );
          })}
      </CollapsibleContent>
    </div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} data-path={node.path}>
      {content}
    </Collapsible>
  );
};
