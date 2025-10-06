/**
 * Represents a node in a hierarchical tree structure
 * @property name The display name of this node (single segment, e.g., "Electricity")
 * @property path The full path to this node, pipe-separated (e.g., "Capacity|Electricity")
 * @property children Child nodes nested under this node
 * @property selectableItems Items whose full hierarchical path ends at this node
 * @property count Total number of selectable items under this node (including all descendants)
 *
 * @template T - The type of items stored in the tree (must have a 'name' property)
 */
export interface TreeNode<T> {
  name: string;
  path: string;
  children: TreeLevel<T>;
  selectableItems: T[];
  count: number;
}

/**
 * Represents a level in the tree hierarchy
 * Maps node names to their corresponding TreeNode objects
 */
export type TreeLevel<T> = Record<string, TreeNode<T>>;

/**
 * Builds a hierarchical tree structure from flat items with pipe-separated names
 *
 * @template T - Item type that must have a 'name' property with pipe-separated hierarchy
 * @param items - Array of items to organize into a tree
 * @returns Root level of the tree structure
 *
 * @example
 * Input: [{ name: "A|B|C" }, { name: "A|B|D" }]
 * Output: { A: { children: { B: { children: { C: {...}, D: {...} } } } } }
 */
export const buildTree = <T extends { name: string }>(items: T[]): TreeLevel<T> => {
  const tree: TreeLevel<T> = {};

  items.forEach((item) => {
    const parts = item.name.split("|").map((part) => part.trim());
    if (parts.length === 0) return;

    let currentLevel: TreeLevel<T> = tree;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          path: parts.slice(0, index + 1).join("|"),
          children: {},
          selectableItems: [],
          count: 0,
        };
      }

      if (index === parts.length - 1) {
        currentLevel[part].selectableItems.push(item);
      }

      currentLevel = currentLevel[part].children;
    });
  });

  const calculateCounts = (node: TreeNode<T>): number => {
    let count = node.selectableItems.length;

    Object.values(node.children).forEach((child) => {
      count += calculateCounts(child);
    });

    node.count = count;
    return count;
  };

  Object.values(tree).forEach(calculateCounts);

  return tree;
};
