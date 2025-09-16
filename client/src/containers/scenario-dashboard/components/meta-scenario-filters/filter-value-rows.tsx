import { XCircle } from "lucide-react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
} from "@/lib/config/filters/climate-filter-config";

interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterTag({ label, value, onRemove }: FilterTagProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-sm">
      {label}: {value}
      <XCircle onClick={onRemove} size={16} className="text-foreground cursor-pointer" />
    </div>
  );
}

export default function FilterValueRows() {
  const { climate, energy, land, setClimate, setEnergy, setLand } = useScenarioDashboardUrlParams();

  const climateCategory = climate?.find(
    (item, i) => climate[i - 1] === CLIMATE_CATEGORY_FILTER_CONFIG.name,
  );
  const yearNetZero = climate?.find(
    (item, i) => climate[i - 1] === YEAR_NET_ZERO_FILTER_CONFIG.name,
  );

  return (
    <div className="container mx-auto flex w-full flex-wrap gap-2 pt-5">
      {climateCategory && (
        <FilterTag
          label="Climate"
          value={climateCategory}
          onRemove={() =>
            setClimate(
              climate?.filter(
                (item, i) =>
                  item !== CLIMATE_CATEGORY_FILTER_CONFIG.name &&
                  climate[i - 1] !== CLIMATE_CATEGORY_FILTER_CONFIG.name,
              ) || [],
            )
          }
        />
      )}

      {yearNetZero && (
        <FilterTag
          label="Net Zero"
          value={yearNetZero}
          onRemove={() =>
            setClimate(
              climate?.filter(
                (item, i) =>
                  item !== YEAR_NET_ZERO_FILTER_CONFIG.name &&
                  climate[i - 1] !== YEAR_NET_ZERO_FILTER_CONFIG.name,
              ) || [],
            )
          }
        />
      )}

      {energy?.map((item, i) => (
        <FilterTag
          key={i}
          label="Energy"
          value={item}
          onRemove={() => setEnergy(energy.filter((_, index) => index !== i))}
        />
      ))}

      {land?.map((item, i) => (
        <FilterTag
          key={i}
          label="Land"
          value={item}
          onRemove={() => setLand(land.filter((_, index) => index !== i))}
        />
      ))}
    </div>
  );
}
