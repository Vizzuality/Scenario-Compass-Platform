"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  FigureTwoVettingMode,
  useFigureTwo,
} from "@/hooks/guided-exploration/figure-two/use-figure-two";
import { CanvasMultiLinePlot } from "@/components/plots/plot-variations/canvas/canvas-multi-line-plot";
import { ExtendedRun } from "@/types/data/run";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { Label } from "@/components/ui/label";
import { ComboboxVariableSelect } from "@/components/plots/components/variable-select/combobox-variable-select";
import GeographyFilter from "@/containers/scenario-dashboard-container/components/filter-top/geography-filter";
import { useThresholdSliders } from "@/hooks/guided-exploration/figure-two/use-threshold-sliders";
import { ThresholdSliders } from "@/containers/guided-exploration-container/threshold-sliders";
import { createThresholdColorFn } from "@/lib/config/guided-exploration/threshold-colors";
import { FLAG_THRESHOLDS } from "@/lib/config/guided-exploration/capacity-thresholds";
import { Button } from "@/components/ui/button";
import { useConcernSummary } from "@/hooks/guided-exploration/figure-two/use-concern-summary";
import { ConcernSummary } from "@/containers/guided-exploration-container/concern-summary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { hasVettingFlag } from "@/utils/plots/filtering-functions";
import { ThresholdGuide } from "@/components/plots/plot-variations/canvas/renderers";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { reasonsForConcernMap } from "@/lib/config/reasons-of-concern/tooltips";

const VETTING_MODE_OPTIONS: Array<{ value: FigureTwoVettingMode; label: string }> = [
  { value: "show", label: "Show" },
  { value: "hide", label: "Hide" },
  { value: "grey-out", label: "Grey-out" },
];

const HIGH_THRESHOLD_COLOR = "#E33021";
const MEDIUM_THRESHOLD_COLOR = "#ED8936";

export function GuidedExplorationFigTwo() {
  const {
    runs,
    isLoading: isChartLoading,
    isError: isChartError,
    variable,
    setVariable,
    resetFigureTwoControls,
    vettingMode,
    setVettingMode,
  } = useFigureTwo();

  const {
    data: variableOptions,
    isLoading: isVariablesLoading,
    isError: isVariablesError,
  } = useQuery({
    ...queryKeys.variables.list(),
  });

  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const [selectedRun, setSelectedRun] = useState<ExtendedRun | null>(null);

  const availableBands = FLAG_THRESHOLDS[variable] ?? [];

  const [selectedBandName, setSelectedBandName] = useState<string>(
    () => availableBands[0]?.name ?? "",
  );

  useEffect(() => {
    setSelectedBandName(FLAG_THRESHOLDS[variable]?.[0]?.name ?? "");
  }, [variable]);

  const activeConfig = availableBands.find((b) => b.name === selectedBandName) ?? availableBands[0];

  const filteredVariableOptions = useMemo(() => {
    if (!variableOptions) return [];
    const allowedNames = new Set(Object.keys(FLAG_THRESHOLDS));
    return variableOptions.filter((v) => allowedNames.has(v.name));
  }, [variableOptions]);

  const {
    thresholds,
    setHighLower,
    setHighUpper,
    setMediumLower,
    setMediumUpper,
    commitHighLower,
    commitHighUpper,
    commitMediumLower,
    commitMediumUpper,
    reset: resetThresholds,
  } = useThresholdSliders({ variable, bandName: selectedBandName });

  const thresholdYear = activeConfig?.year ?? 2030;
  const includeUnvettedInThresholds = vettingMode === "show";
  const showUnvettedInPlot = vettingMode !== "hide";

  const summaryRuns = useMemo(() => {
    if (vettingMode !== "hide") return runs;
    return runs?.filter(hasVettingFlag);
  }, [runs, vettingMode]);

  const summary = useConcernSummary(
    summaryRuns,
    thresholds,
    thresholdYear,
    includeUnvettedInThresholds,
  );

  const getLineColor = createThresholdColorFn(
    thresholds,
    thresholdYear,
    includeUnvettedInThresholds,
  );

  const thresholdGuides = useMemo((): ThresholdGuide[] => {
    const guides: ThresholdGuide[] = [];

    if (thresholds.high.upper !== undefined) {
      guides.push({
        year: thresholdYear,
        value: thresholds.high.upper,
        label: "High upper",
        color: HIGH_THRESHOLD_COLOR,
      });
    }

    if (thresholds.high.lower !== undefined) {
      guides.push({
        year: thresholdYear,
        value: thresholds.high.lower,
        label: "High lower",
        color: HIGH_THRESHOLD_COLOR,
      });
    }

    if (thresholds.medium.upper !== undefined) {
      guides.push({
        year: thresholdYear,
        value: thresholds.medium.upper,
        label: "Medium upper",
        color: MEDIUM_THRESHOLD_COLOR,
      });
    }

    if (thresholds.medium.lower !== undefined) {
      guides.push({
        year: thresholdYear,
        value: thresholds.medium.lower,
        label: "Medium lower",
        color: MEDIUM_THRESHOLD_COLOR,
      });
    }

    return guides;
  }, [thresholds, thresholdYear]);

  const yExtent = useMemo(() => {
    const values = [
      ...(runs?.flatMap((run) => run.orderedPoints.map((point) => point.value)) ?? []),
      ...thresholdGuides.map((guide) => guide.value),
    ];

    if (!values.length) return undefined;

    return {
      yMin: Math.min(...values),
      yMax: Math.max(...values),
    };
  }, [runs, thresholdGuides]);

  const maxSliderValue = useMemo(() => {
    if (!activeConfig?.high?.upper) return 15000;
    return Math.ceil(activeConfig.high.upper * 1.5);
  }, [activeConfig]);

  const unit = useMemo(() => {
    if (variable.includes("Energy")) return "EJ";
    if (variable.includes("Carbon")) return "Mt CO2";
    if (variable.includes("Food")) return "kcal";
    return "GW";
  }, [variable]);

  const handleRunClick = (run: ExtendedRun) => {
    window.open(buildRunDetailsUrl(run), "_blank");
  };

  const handleVariableChange = (variableId: number) => {
    const match = variableOptions?.find((v) => v.id === variableId);
    if (match) setVariable(match.name);
  };

  return (
    <div className="bg-card my-8 rounded-xl p-6">
      <div className="flex flex-col gap-1 md:flex-row">
        <div className="flex aspect-[4/3] w-full rounded-lg bg-white">
          <CanvasMultiLinePlot
            data={{ runs, isLoading: isChartLoading, isError: isChartError }}
            zoomEnabled={false}
            onRunClick={handleRunClick}
            selectedRun={selectedRun}
            onSelectedRunChange={setSelectedRun}
            yExtent={yExtent}
            getLineColor={getLineColor}
            showVettingOverride={showUnvettedInPlot}
            thresholdGuides={thresholdGuides}
          />
        </div>

        <div className="flex max-w-xs shrink-0 flex-col gap-6 md:w-80">
          <div className="flex flex-col gap-4">
            <GeographyFilter variant="dark" />

            <div className="flex flex-col gap-2">
              <Label className="font-bold">Variable</Label>
              <ComboboxVariableSelect
                isLoading={isVariablesLoading}
                isError={isVariablesError}
                options={filteredVariableOptions}
                value={filteredVariableOptions?.find((v) => v.name === variable)?.id}
                onSelectAction={(id) => handleVariableChange(Number(id))}
              />
            </div>

            {activeConfig ? (
              <div className="mb-4 flex flex-col gap-2">
                <Label className="font-bold">
                  Flag{" "}
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon size={16} />
                      <TooltipContent className="max-w-100">
                        {reasonsForConcernMap[selectedBandName].description}
                      </TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </Label>

                <Select value={selectedBandName} onValueChange={setSelectedBandName}>
                  <SelectTrigger className="w-full text-xs" size="lg">
                    <SelectValue>{selectedBandName}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableBands.map((band) => (
                      <SelectItem key={band.name} value={band.name} className="text-xs">
                        {band.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="mb-4 text-xs text-slate-400 italic">
                No expert thresholds for this variable.
              </p>
            )}

            <ThresholdSliders
              thresholds={thresholds}
              onHighLowerChange={setHighLower}
              onHighUpperChange={setHighUpper}
              onMediumLowerChange={setMediumLower}
              onMediumUpperChange={setMediumUpper}
              onHighLowerCommit={commitHighLower}
              onHighUpperCommit={commitHighUpper}
              onMediumLowerCommit={commitMediumLower}
              onMediumUpperCommit={commitMediumUpper}
              min={0}
              max={maxSliderValue}
              unit={unit}
            />

            <div className="flex flex-col gap-2">
              <Label className="font-bold">Scenarios that don't pass vetting</Label>
              <div className="grid grid-cols-3 overflow-hidden bg-white">
                {VETTING_MODE_OPTIONS.map((option, index) => {
                  const isSelected = vettingMode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setVettingMode(option.value)}
                      className={cn(
                        "border px-3 py-2 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-black bg-black text-white"
                          : "hover:bg-slate-50 hover:text-black",
                        index === VETTING_MODE_OPTIONS.length - 1 && "rounded-r-md",
                        index === 0 && "rounded-l-md",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <ConcernSummary
              high={summary.high}
              medium={summary.medium}
              none={summary.none}
              unvetted={summary.unvetted}
            />

            <Button
              type="button"
              variant="tertiary"
              size="lg"
              onClick={() => {
                resetFigureTwoControls();
                resetThresholds();
              }}
              className="border-compass-sand w-full border bg-white"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
