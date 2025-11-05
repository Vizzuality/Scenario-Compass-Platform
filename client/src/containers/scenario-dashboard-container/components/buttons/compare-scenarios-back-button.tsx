"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { Button } from "@/components/ui/button";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";

export default function CompareScenariosBackButton() {
  const router = useRouter();
  const { year, startYear, endYear, geography } = useBaseUrlParams();
  const geoName = geographyConfig.find((option) => option.id === geography);

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
        {geoName ? ` ${geoName.name}` : ""} |{year ? ` for ${year}` : ""}
        {startYear && endYear ? ` ${startYear} - ${endYear}` : ""}
      </p>
    </Button>
  );
}
