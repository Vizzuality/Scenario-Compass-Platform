import { useSciWeightedStatsParams } from "@/hooks/nuqs/plots/use-sci-weighted-stats-params";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { useEffect } from "react";

export function WeighteningToggle(prefix: { prefix?: string }) {
  const { showSciWeightedMedian, setShowSciWeightedMedian, setShowSciWeightedPercentiles } =
    useSciWeightedStatsParams(prefix);
  const { showVetting } = useScenarioFlagsSelection(prefix.prefix || "");

  const handleSciWeightedMedianChange = (checked: boolean) => {
    setShowSciWeightedMedian(checked);
    if (!checked) {
      setShowSciWeightedPercentiles(false);
    }
  };

  useEffect(() => {
    if (showVetting && showSciWeightedMedian) {
      setShowSciWeightedMedian(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVetting]);

  return (
    <>
      <div className="mt-4 mb-1 flex w-full gap-3 border-b pb-1">
        <strong className="text-base text-stone-800">Weighted median</strong>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground flex size-5 items-center justify-center"
              aria-label="Weighted statistics information"
            >
              <InfoIcon size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-70">
            <p>
              The diagnostic indicators are computed according to ensemble-derived weights that
              account for relevance, quality and diversity.{" "}
              <a
                href="https://doi.org/10.1038/s41558-026-02565-5"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Read more -&gt; https://doi.org/10.1038/s41558-026-02565-5
              </a>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="show-sci-weighted-median"
          checked={showSciWeightedMedian}
          disabled={showVetting}
          onCheckedChange={handleSciWeightedMedianChange}
        />
        <label
          htmlFor="show-sci-weighted-median"
          className="flex-1 text-sm leading-snug text-stone-900"
        >
          Show weighted median (beta)
        </label>
      </div>
      {/*<div className="flex items-center gap-3">*/}
      {/*  <Switch*/}
      {/*    id="show-sci-weighted-percentiles"*/}
      {/*    checked={showSciWeightedPercentiles}*/}
      {/*    disabled={!showSciWeightedMedian}*/}
      {/*    onCheckedChange={setShowSciWeightedPercentiles}*/}
      {/*  />*/}
      {/*  <label*/}
      {/*    htmlFor="show-sci-weighted-percentiles"*/}
      {/*    className="flex-1 text-sm leading-snug text-stone-900"*/}
      {/*  >*/}
      {/*    Show weighted 5-95% range*/}
      {/*  </label>*/}
      {/*</div>*/}
    </>
  );
}
