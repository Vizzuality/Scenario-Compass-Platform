import { AdvancedFilterSkeleton } from "@/containers/scenario-dashboard-container/components/meta-scenario-filters/filter-skeleton";

export default function MetaIndicatorsFilterSkeleton(): React.ReactElement {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto flex h-fit w-full gap-6 pt-6 pb-2">
        <AdvancedFilterSkeleton />
        <AdvancedFilterSkeleton />
        <AdvancedFilterSkeleton />
        <AdvancedFilterSkeleton />
      </div>
    </div>
  );
}
