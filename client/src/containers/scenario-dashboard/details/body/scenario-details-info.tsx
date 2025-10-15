import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import {
  CLIMATE_CATEGORY_META_INDICATOR_KEY,
  CUMULATIVE_EMISSIONS_META_INDICATOR_KEY,
  YEAR_NET_ZERO_GHG_META_INDICATOR_KEY,
  YEAR_NET_ZERO_META_INDICATOR_KEY,
  YEAR_PEAK_TEMPERATURE_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";
import { ADDITIONAL_INFORMATION_META_INDICATORS } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";
import { Skeleton } from "@/components/ui/skeleton";

interface InfoItemProps {
  title: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value }) => {
  return (
    <div className="text-foreground flex items-center justify-center gap-2">
      <span>•</span>
      <div className="flex flex-1 justify-between text-sm">
        <p>{title}</p>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default function ScenarioDetailsInfo() {
  const { scenario, model } = useBaseUrlParams();

  const { data: metaData, isLoading } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      run: {
        scenario: {
          id: Number(scenario),
        },
        model: {
          id: Number(model),
        },
      },
    }),
    select: (data) => getMetaPoints(data),
  });

  const climateCategory = metaData?.find((item) =>
    item.key.includes(CLIMATE_CATEGORY_META_INDICATOR_KEY),
  ) || { value: "Loading Category" };

  const projectName = metaData?.find(
    (item) => item.key === ADDITIONAL_INFORMATION_META_INDICATORS[0].key,
  ) || { value: "Loading Project" };

  const studyName = metaData?.find(
    (item) => item.key === ADDITIONAL_INFORMATION_META_INDICATORS[1].key,
  ) || { value: "Loading Study" };

  const yearNetZeroCO2 = metaData?.find((item) =>
    item.key.includes(YEAR_NET_ZERO_META_INDICATOR_KEY),
  ) || { value: "Not available" };

  const yearNetZeroGHG = metaData?.find((item) =>
    item.key.includes(YEAR_NET_ZERO_GHG_META_INDICATOR_KEY),
  ) || { value: "Not available" };

  const cumulativeEmissions = metaData?.find((item) =>
    item.key.includes(CUMULATIVE_EMISSIONS_META_INDICATOR_KEY),
  ) || {
    value: "Loading Emissions",
  };

  const peakTemperature = metaData?.find((item) =>
    item.key.includes(YEAR_PEAK_TEMPERATURE_META_INDICATOR_KEY),
  ) || { value: "Loading Temperature" };

  const cumulativeEmissionsWithUnit =
    Number(cumulativeEmissions.value).toFixed(3).toString() + " Gt CO2";

  return (
    <div className="space-y-2">
      <h1 className="w-full border-b text-base font-bold text-stone-800">Scenario Details</h1>
      {isLoading ? (
        <div className="flex w-full flex-col gap-3">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      ) : (
        <>
          <InfoItem title="Climate category" value={climateCategory.value} />
          <InfoItem title="Cumulative emissions" value={cumulativeEmissionsWithUnit} />
          <InfoItem title="Peak temperature" value={peakTemperature.value} />
          <InfoItem title="Year of net-zero CO2" value={yearNetZeroCO2.value} />
          <InfoItem title="Year of net-zero GHG" value={yearNetZeroGHG.value} />
          <InfoItem title="Project" value={projectName.value} />
          <InfoItem title="Study" value={studyName.value} />
        </>
      )}
    </div>
  );
}
