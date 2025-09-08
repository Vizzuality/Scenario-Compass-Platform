"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { Button } from "@/components/ui/button";

export default function CompareScenariosBackButton() {
  const router = useRouter();
  const { year, startYear, endYear, geography } = useScenarioDashboardUrlParams();
  const geoName = geographyConfig.find((option) => option.value === geography);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleGoBack}
      className="text-primary flex items-center gap-2 rounded text-2xl leading-8 font-normal"
    >
      <ArrowLeftIcon size={16} />
      <p className="leading-none">
        {geoName ? ` ${geoName.lookupName}` : ""} |{year ? ` for ${year}` : ""}
        {startYear && endYear ? ` ${startYear} - ${endYear}` : ""}
      </p>
    </Button>
  );
}
