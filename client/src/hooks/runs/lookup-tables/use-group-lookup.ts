import { useMemo } from "react";

/**
 * Generic hook to create a memoized lookup map from an array of items
 * @param items - Array of items to group
 * @param getKey - Function to extract the grouping key from each item
 * @param transform - Optional function to transform items before storing
 */
export function useGroupLookup<T, K = T>(
  items: T[] | undefined,
  getKey: (item: T) => string,
  transform?: (item: T) => K,
): Map<string, K[]> {
  return useMemo(() => {
    if (!items?.length) return new Map();

    const lookup = new Map<string, K[]>();
    items.forEach((item) => {
      const key = getKey(item);
      if (!lookup.has(key)) {
        lookup.set(key, []);
      }
      const transformedItem = transform ? transform(item) : (item as unknown as K);
      lookup.get(key)!.push(transformedItem);
    });

    return lookup;
  }, [items, getKey, transform]);
}
