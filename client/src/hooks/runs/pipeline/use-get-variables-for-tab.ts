import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";

/**
 * A React hook that retrieves variables based on the currently selected tab.
 *
 * Handles two scenarios:
 * - For custom tabs: Fetches all available variables from the API and filters them based on custom variable selections
 * - For predefined tabs: Returns the pre-configured variables associated with that tab
 *
 * @param params - Configuration object
 * @param params.prefix - Optional URL parameter prefix for reading namespaced query parameters
 *
 * @returns An object containing:
 * - `variables`: Array of variable names for the selected tab
 * - `selectedTab`: The currently selected tab object with its configuration
 *
 * @example
 * ```typescript
 * const { variables, selectedTab } = useGetVariablesForTab({ prefix: 'comparison' });
 *
 * // For custom tabs, variables might be: ['Custom Variable 1', 'Custom Variable 2']
 * // For predefined tabs, variables might be: ['Temperature|Global Mean', 'Emissions|CO2']
 * ```
 *
 * @remarks
 * - The API query only runs when a custom tab is selected (`selectedTab.isCustom === true`)
 * - Falls back to an empty array if API data is unavailable for custom tabs
 */
export default function useGetVariablesForTab({ prefix }: { prefix?: string }) {
  const { selectedTab, allSelectedVariables, getAllCustomVariables } =
    useTabAndVariablesParams(prefix);

  const { data } = useQuery({
    ...queryKeys.variables.list(),
    enabled: selectedTab.isCustom,
  });

  const variables = selectedTab.isCustom
    ? getAllCustomVariables(data || [])
    : allSelectedVariables();

  return { variables, selectedTab };
}
