"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { useFigureTwo } from "@/hooks/runs/guided-exploration/use-figure-two";
import { CanvasMultiLinePlot } from "@/components/plots/plot-variations/canvas/canvas-multi-line-plot";
import { ExtendedRun } from "@/types/data/run";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { Label } from "@/components/ui/label";
import { ComboboxVariableSelect } from "@/components/plots/components/variable-select/combobox-variable-select";
import GeographyFilter from "@/containers/scenario-dashboard-container/components/filter-top/geography-filter";
import { useThresholdSliders } from "@/hooks/runs/guided-exploration/use-threshold-sliders";
import { ThresholdSliders } from "@/containers/guided-exploration-container/threshold-sliders";
import { createThresholdColorFn } from "@/lib/config/guided-exploration/threshold-colors";
import { FLAG_THRESHOLDS } from "@/lib/config/guided-exploration/capacity-thresholds";
import { Button } from "@/components/ui/button";
import { useConcernSummary } from "@/hooks/runs/guided-exploration/use-concern-summary";
import { ConcernSummary } from "@/containers/guided-exploration-container/concern-summary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function GuidedExplorationFigTwo() {
  const {
    runs,
    isLoading: isChartLoading,
    isError: isChartError,
    variable,
    setVariable,
    resetFigureTwoControls,
    includeUnvetted,
    setIncludeUnvetted,
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

  const activeConfig = useMemo(
    () => availableBands.find((b) => b.name === selectedBandName) ?? availableBands[0],
    [availableBands, selectedBandName],
  );

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
    reset: resetThresholds,
  } = useThresholdSliders({ variable, bandName: selectedBandName });

  const thresholdYear = activeConfig?.year ?? 2030;

  const summary = useConcernSummary(runs, thresholds, thresholdYear, includeUnvetted);

  const getLineColor = useMemo(
    () => createThresholdColorFn(thresholds, thresholdYear, includeUnvetted),
    [thresholds, includeUnvetted],
  );

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
      <div className="flex flex-col gap-8 md:flex-row md:gap-6">
        <div className="flex aspect-[4/3] w-full rounded-lg bg-white">
          <CanvasMultiLinePlot
            data={{ runs, isLoading: isChartLoading, isError: isChartError }}
            zoomEnabled={false}
            onRunClick={handleRunClick}
            selectedRun={selectedRun}
            onSelectedRunChange={setSelectedRun}
            getLineColor={getLineColor}
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

            <Button
              type="button"
              variant="tertiary"
              size="lg"
              onClick={() => {
                resetFigureTwoControls();
                resetThresholds();
              }}
              className="border-compass-sand border bg-white"
            >
              Reset
            </Button>

            <div className="flex items-center gap-2">
              <Switch checked={includeUnvetted} onCheckedChange={setIncludeUnvetted} />
              <Label className="text-xs text-slate-600">Include unvetted in summary</Label>
            </div>

            <ConcernSummary
              high={summary.high}
              medium={summary.medium}
              none={summary.none}
              unvetted={summary.unvetted}
            />

            <div className="mt-4 pt-4">
              {activeConfig ? (
                <div className="mb-4">
                  <Select value={selectedBandName} onValueChange={setSelectedBandName}>
                    <SelectTrigger className="w-full text-xs">
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
                min={0}
                max={maxSliderValue}
                unit={unit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
