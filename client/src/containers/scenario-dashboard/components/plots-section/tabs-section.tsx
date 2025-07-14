import { cn } from "@/lib/utils";
import { TabItem, tabsArray } from "@/containers/scenario-dashboard/components/plots-section/utils";

interface Props {
  selectedTab: TabItem;
  onSelectTab: (tab: TabItem) => void;
}

export function TabsSection({ selectedTab, onSelectTab }: Props) {
  return (
    <div className="flex w-full bg-white pt-9">
      <div className="w-full border-b" />
      <div className="container mx-auto flex shrink-0 pt-4">
        {tabsArray.map((tab, index) => (
          <button
            key={index}
            className={cn(
              "w-full rounded-t-md px-4 py-3 text-xs font-bold uppercase",
              selectedTab === tab.name ? "bg-background border border-b-0" : "border-b bg-white",
            )}
            onClick={() => {
              onSelectTab(tab.name as TabItem);
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="w-full border-b" />
    </div>
  );
}
