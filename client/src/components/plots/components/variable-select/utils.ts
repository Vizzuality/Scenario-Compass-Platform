import { TreeLevel, TreeNode } from "@/components/plots/components/variable-select/build-tree";
import { Variable } from "@iiasa/ixmp4-ts";

/**
 * Filters a tree node and its children based on search query
 * Returns a new tree with only matching nodes, or null if no matches
 */
export const filterTreeNode = (
  node: TreeNode<Variable>,
  searchQuery: string,
): TreeNode<Variable> | null => {
  const query = searchQuery.toLowerCase().trim();

  if (!query) {
    return node; // No filter, return original node
  }

  // Filter selectable items at this level
  const filteredItems = node.selectableItems.filter((item) =>
    item.name.toLowerCase().includes(query),
  );

  // Recursively filter children
  const filteredChildren: TreeLevel<Variable> = {};
  Object.entries(node.children).forEach(([key, childNode]) => {
    const filteredChild = filterTreeNode(childNode, query);
    if (filteredChild) {
      filteredChildren[key] = filteredChild;
    }
  });

  // If this node has no matches and no matching children, exclude it
  if (filteredItems.length === 0 && Object.keys(filteredChildren).length === 0) {
    return null;
  }

  // Calculate filtered count
  const calculateFilteredCount = (treeNode: TreeNode<Variable>): number => {
    let count = treeNode.selectableItems.length;
    Object.values(treeNode.children).forEach((child) => {
      count += calculateFilteredCount(child);
    });
    return count;
  };

  return {
    ...node,
    selectableItems: filteredItems,
    children: filteredChildren,
    count: calculateFilteredCount({
      ...node,
      selectableItems: filteredItems,
      children: filteredChildren,
    }),
  };
};

/**
 * Filters the entire tree based on search query
 */
export const filterTree = (tree: TreeLevel<Variable>, searchQuery: string): TreeLevel<Variable> => {
  const filteredTree: TreeLevel<Variable> = {};

  Object.entries(tree).forEach(([key, node]) => {
    const filteredNode = filterTreeNode(node, searchQuery);
    if (filteredNode) {
      filteredTree[key] = filteredNode;
    }
  });

  return filteredTree;
};
