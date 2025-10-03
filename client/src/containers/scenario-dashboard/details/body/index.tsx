import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";
import NoRunDetailsSelection from "@/containers/scenario-dashboard/details/body/no-run-details-selection";
import ScenarioDetailPlots from "@/containers/scenario-dashboard/details/body/scenario-detail-plots";

export default function RunDetailsBody() {
  const { model, geography, scenario, startYear, endYear } = useBaseUrlParams({
    useDefaults: false,
  });

  const showPlots = !!model && !!geography && !!scenario && !!startYear && !!endYear;

  return <>{!showPlots ? <NoRunDetailsSelection /> : <ScenarioDetailPlots />}</>;
}
