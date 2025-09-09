"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GeographyYearInfo from "@/containers/scenario-dashboard/scenario-detail/geography-year-info";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { ADDITIONAL_INFORMATION_META_INDICATORS } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
import {
  CUMULATIVE_EMISSIONS_META_INDICATOR_KEY,
  YEAR_NET_ZERO_META_INDICATOR_KEY,
  YEAR_PEAK_TEMPERATURE_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";

interface InfoItemProps {
  title: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value }) => (
  <div className="h-fit">
    <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{value}</p>
  </div>
);

export default function ScenarioDetails({ runId }: { runId: number }) {
  const router = useRouter();

  const { data: runs = [] } = useQuery({
    ...queryKeys.runs.details(runId),
  });

  const { data: metaData } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      run: {
        id: runId,
      },
    }),
    select: (data) => getMetaPoints(data),
  });

  const climateCategory = metaData?.find((item) =>
    item.key.includes("Climate Assessment|Category [Name]"),
  ) || { value: "Loading Category" };

  const projectName = metaData?.find(
    (item) => item.key === ADDITIONAL_INFORMATION_META_INDICATORS[0].key,
  ) || { value: "Loading Project" };

  const studyName = metaData?.find(
    (item) => item.key === ADDITIONAL_INFORMATION_META_INDICATORS[1].key,
  ) || { value: "Loading Study" };

  const yearNetZeroCO2 = metaData?.find((item) =>
    item.key.includes(YEAR_NET_ZERO_META_INDICATOR_KEY),
  ) || { value: "Loading Year" };

  const cumulativeEmissions = metaData?.find((item) =>
    item.key.includes(CUMULATIVE_EMISSIONS_META_INDICATOR_KEY),
  ) || {
    value: "Loading Emissions",
  };

  const peakTemperature = metaData?.find((item) =>
    item.key.includes(YEAR_PEAK_TEMPERATURE_META_INDICATOR_KEY),
  ) || { value: "Loading Temperature" };

  const scenarioName = runs[0]?.scenario?.name || "Loading Scenario";
  const modelName = runs[0]?.model?.name || "Loading Model";

  return (
    <div className="container mx-auto mb-8">
      <div className="mb-8 flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          size="lg"
          className="text-base leading-6 font-normal"
          variant="ghost"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <div className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-900">
          {scenarioName} - {modelName}
        </h1>
        <Share2 />
      </div>

      <div className="grid grid-cols-[1fr_3fr] items-end gap-16">
        <GeographyYearInfo />
        <div className="grid h-fit grid-cols-4 grid-rows-2 justify-between gap-4">
          <InfoItem title="Climate category" value={climateCategory.value} />
          <InfoItem title="Cumulative emissions" value={cumulativeEmissions.value} />
          <InfoItem title="Peak temperature" value={peakTemperature.value} />
          <InfoItem title="Year of CO2/GHG net-zero" value={yearNetZeroCO2.value} />
          <InfoItem title="Model" value={modelName} />
          <InfoItem title="Project" value={projectName.value} />
          <InfoItem title="Study" value={studyName.value} />
        </div>
      </div>
    </div>
  );
}
