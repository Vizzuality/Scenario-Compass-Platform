"use client";

import { cn } from "@/lib/utils";
import { TABS_CONFIG_ARRAY } from "@/lib/config/tabs/tabs-config";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";

export function TabsSection() {
  const { selectedTab, setSelectedTab } = useTabAndVariablesParams();

  return (
    <div className="flex w-full bg-white pt-9">
      <div className="w-full border-b" />
      <div className="container mx-auto flex shrink-0 pt-4">
        {TABS_CONFIG_ARRAY.map((tab, index) => (
          <button
            key={index}
            className={cn(
              "w-full cursor-pointer rounded-t-md px-4 py-3 text-xs font-bold uppercase",
              selectedTab.tabTitle === tab.tabTitle
                ? "bg-background border border-b-0"
                : "border-b bg-white hover:bg-stone-50",
            )}
            onClick={() => {
              setSelectedTab(tab);
            }}
          >
            {tab.tabTitle}
          </button>
        ))}
      </div>
      <div className="w-full border-b" />
    </div>
  );
}
