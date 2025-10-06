import { TreeNode } from "@/components/plots/components/variable-select/build-tree";
import { Variable } from "@iiasa/ixmp4-ts";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TreeNodeComponentProps {
  node: TreeNode<Variable>;
  level?: number;
  isRootLevel?: boolean;
  selectedValue?: Variable["id"];
  onSelect: (value: Variable["id"]) => void;
  searchQuery?: string;
}

export const TreeNodeComponent = ({
  node,
  level = 0,
  isRootLevel = false,
  selectedValue,
  onSelect,
  searchQuery = "",
}: TreeNodeComponentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const hasSelectableItemsAtCurrentLevel = node.selectableItems.length > 0;
  const hasChildren = Object.keys(node.children).length > 0;
  const indent = level * 12;

  const containsSelectedValue = (treeNode: TreeNode<Variable>): boolean => {
    if (treeNode.selectableItems.some((item) => item.id === selectedValue)) {
      return true;
    }

    return Object.values(treeNode.children).some((child) => containsSelectedValue(child));
  };

  const hasSelectedDescendant = selectedValue !== undefined && containsSelectedValue(node);

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
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
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
            isRootLevel={false}
            selectedValue={selectedValue}
            onSelect={onSelect}
            searchQuery={searchQuery}
          />
        ))}

        {hasSelectableItemsAtCurrentLevel && (
          <>
            {node.selectableItems.map((variable) => {
              const isSelected = selectedValue === variable.id;
              return (
                <div
                  key={variable.id}
                  className={cn(
                    "hover:bg-accent flex cursor-pointer items-center gap-2 px-2 py-1.5",
                    isSelected && "bg-accent", // Highlight selected item
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
          </>
        )}
      </CollapsibleContent>
    </div>
  );

  if (isRootLevel) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {content}
      </Collapsible>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} data-path={node.path}>
      {content}
    </Collapsible>
  );
};
