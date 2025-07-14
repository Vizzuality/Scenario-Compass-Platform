"use client";

import useFilterDataPoints from "@/hooks/use-filter-data-points";
import { DemoPlot } from "@/components/plots/demo-plot";
import { useScenarioDashboardUrlParams } from "@/containers/scenario-dashboard/utils/url-store";

export default function Playground() {
  const { geography, year, startYear, endYear } = useScenarioDashboardUrlParams();
  const { data } = useFilterDataPoints({
    geography,
    year,
    startYear,
    endYear,
  });

  return (
    <div className="min-h-screen w-full">
      {data && <DemoPlot data={data || []} width={900} height={500} />}
    </div>
  );
}
