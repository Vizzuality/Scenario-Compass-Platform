import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import NoRunDetailsSelection from "@/containers/scenario-dashboard-container/details-view/body/no-run-details-selection";
import ScenarioDetailPlots from "@/containers/scenario-dashboard-container/details-view/body/scenario-detail-plots";

export default function RunDetailsBody() {
  const { model, geography, scenario, startYear, endYear } = useBaseUrlParams({
    useDefaults: false,
  });

  const showPlots = !!model && !!geography && !!scenario && !!startYear && !!endYear;

  return <>{!showPlots ? <NoRunDetailsSelection /> : <ScenarioDetailPlots />}</>;
}
