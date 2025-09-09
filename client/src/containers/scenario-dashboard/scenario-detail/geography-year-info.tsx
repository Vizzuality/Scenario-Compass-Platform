import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import GeographyFilter from "@/containers/scenario-dashboard/components/filter-top/geography-filter";

export default function GeographyYearInfo() {
  const { year, startYear, endYear } = useScenarioDashboardUrlParams();

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
