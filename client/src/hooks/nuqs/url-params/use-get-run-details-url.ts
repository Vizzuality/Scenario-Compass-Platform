import { ExtendedRun } from "@/types/data/run";
import { INTERNAL_PATHS } from "@/lib/paths";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";

export const useGetRunDetailsUrl = () => {
  const { geography, startYear, endYear } = useBaseUrlParams();

  return (run: ExtendedRun) => {
    const params = new URLSearchParams();
    params.set("model", run.modelName);
    params.set("scenario", run.scenarioName);
    if (geography) params.set("geography", geography);
    if (startYear) params.set("startYear", startYear);
    if (endYear) params.set("endYear", endYear);
    return `${INTERNAL_PATHS.RUN_DASHBOARD_EXPLORATION}?${params.toString()}`;
  };
};
