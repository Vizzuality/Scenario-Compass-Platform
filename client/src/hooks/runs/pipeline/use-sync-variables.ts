import queryKeys from "@/lib/query-keys";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { useQuery } from "@tanstack/react-query";
import useSyncRunsPipeline from "@/hooks/runs/pipeline/use-sync-runs-pipeline";

const queryKey = queryKeys.variables.list();

export default function useSyncVariables({ prefix, runId }: { runId?: number; prefix?: string }) {
  const { selectedTab, allSelectedVariables, getAllCustomVariables } =
    useTabAndVariablesParams(prefix);

  const { data } = useQuery({
    ...queryKey,
    enabled: selectedTab.isCustom,
  });

  const variables = selectedTab.isCustom
    ? getAllCustomVariables(data || [])
    : allSelectedVariables();

  const result = useSyncRunsPipeline({ variablesNames: variables, prefix, runId });
  return {
    result,
    variables,
    selectedTab,
  };
}
