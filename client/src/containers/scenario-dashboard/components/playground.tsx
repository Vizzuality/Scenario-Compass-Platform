"use client";

import useFilterDataPoints from "@/hooks/use-filter-data-points";
import { DemoPlot } from "@/components/plots/demo-plot";

export default function Playground() {
  const { data } = useFilterDataPoints();

  return (
    <div className="min-h-screen w-full">
      {data && <DemoPlot data={data || []} width={900} height={500} />}
    </div>
  );
}
