import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";

const queryKey = queryKeys.variables.list();

interface Props {
  prefix?: string;
}

export default function useShowReasonsForConcern({ prefix }: Props) {
  const { selectedTab, getAllCustomVariables } = useTabAndVariablesParams(prefix);
  const { data: variableOptions } = useQuery({
    ...queryKey,
    enabled: selectedTab.isCustom,
  });
  const allVariables = variableOptions ? getAllCustomVariables(variableOptions) : [];
  return selectedTab.isCustom ? allVariables.length > 0 : true;
}
