import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { geographyOptions } from "@/lib/constants";

export default function GeographyYearInfo() {
  const { geography, year, startYear, endYear } = useScenarioDashboardUrlParams();
  const geographyName = geographyOptions.find((option) => option.value === geography)?.label;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-primary text-base leading-6 font-bold">Geography</p>
        <p className="text-primary text-2xl leading-8">{geographyName}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-primary text-base leading-6 font-bold">Year</p>
        <p className="text-primary text-2xl leading-8">
          {startYear === endYear ? year : `${startYear} - ${endYear}`}
        </p>
      </div>
    </div>
  );
}
