import GeographyFilter from "@/containers/scenario-dashboard/components/filter-top/geography-filter";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

export default function GeographyYearInfo() {
  const { year, startYear, endYear } = useBaseUrlParams();

  return (
    <div className="flex flex-col gap-4">
      <GeographyFilter variant="dark" />
      <div className="flex flex-col gap-1">
        <p className="text-primary text-base leading-6 font-bold">Year</p>
        <p className="text-primary text-2xl leading-8">
          {startYear === endYear ? year : `${startYear} - ${endYear}`}
        </p>
      </div>
    </div>
  );
}
