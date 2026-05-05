import { parseAsString, useQueryState } from "nuqs";
import { getParamName } from "@/utils/url-params-utils";

export function useSelectedRunParam(prefix: string = "") {
  const paramName = getParamName("selectedRunId", prefix);

  const [selectedRunId, setSelectedRunId] = useQueryState(
    paramName,
    parseAsString.withOptions({
      shallow: false,
      history: "replace",
    }),
  );

  return {
    selectedRunId,
    setSelectedRunId,
  };
}
