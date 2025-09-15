import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { CATEGORY_CONFIG } from "@/lib/config/reasons-of-concern/category-config";

function extendedRunToCsv(
  runs: ExtendedRun[],
  options?: {
    delimiter?: string;
    format?: "long" | "wide";
  },
): string {
  const delimiter = options?.delimiter ?? ",";
  const format = options?.format ?? "long";

  if (runs.length === 0) return "";

  // Collect all unique meta indicator keys from all runs since some runs might have different meta indicators
  const allMetaKeys = [
    ...new Set(runs.flatMap((run) => run.metaIndicators.map((meta) => meta.key))),
  ];

  if (format === "long") {
    const headers = [
      "Run ID",
      "Scenario name",
      "Model name",
      "Variable name",
      "unit",
      "Flag Category",
      "year",
      "value",
      ...allMetaKeys.map((key) => `meta_${key}`),
    ];

    const csvRows = [headers.map((h) => `"${h}"`).join(delimiter)];

    runs.forEach((run) => {
      run.orderedPoints.forEach((point) => {
        const row = [
          `"${run.runId}"`,
          `"${run.scenarioName}"`,
          `"${run.modelName}"`,
          `"${run.variableName}"`,
          `"${run.unit}"`,
          `"${CATEGORY_CONFIG[run.flagCategory]}"`,
          point.year,
          point.value,
          ...allMetaKeys.map((key) => {
            const meta = run.metaIndicators.find((m) => m.key === key);
            return meta ? `"${meta.value}"` : "";
          }),
        ];
        csvRows.push(row.join(delimiter));
      });
    });

    return csvRows.join("\n");
  } else {
    const allYears = [...new Set(runs.flatMap((run) => run.orderedPoints.map((p) => p.year)))].sort(
      (a, b) => a - b,
    );

    const headers = [
      "Run ID",
      "Scenario name",
      "Model name",
      "Variable name",
      "unit",
      "Flag Category",
      ...allYears.map((year) => `year_${year}`),
      ...allMetaKeys.map((key) => `meta_${key}`),
    ];

    const csvRows = [headers.map((h) => `"${h}"`).join(delimiter)];

    runs.forEach((run) => {
      const yearValueMap = new Map(run.orderedPoints.map((point) => [point.year, point.value]));

      const row = [
        `"${run.runId}"`,
        `"${run.scenarioName}"`,
        `"${run.modelName}"`,
        `"${run.variableName}"`,
        `"${run.unit}"`,
        `"${CATEGORY_CONFIG[run.flagCategory]}"`,
        ...allYears.map((year) => yearValueMap.get(year) ?? ""),
        ...allMetaKeys.map((key) => {
          const meta = run.metaIndicators.find((m) => m.key === key);
          return meta ? `"${meta.value}"` : "";
        }),
      ];
      csvRows.push(row.join(delimiter));
    });

    return csvRows.join("\n");
  }
}

function downloadCsv(csvContent: string, filename: string = "export.csv"): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPlotCsv(
  runs: ExtendedRun[] | null,
  title: string = "plot_data",
  options?: { delimiter?: string; format?: "long" | "wide" },
) {
  if (!runs) return;

  const csvContent = extendedRunToCsv(runs, options);
  downloadCsv(csvContent, `${title}.csv`);
}
