import { formatNumber } from "@/utils/plots/format-functions";
import { ExtendedRun } from "@/types/data/run";

const OFFSET_X = 12;
const OFFSET_Y = 16;

export interface TooltipHelpers {
  updateContent: (run: ExtendedRun, point: { year: number; value: number }) => void;
  position: (x: number, y: number, containerWidth: number, containerHeight: number) => void;
  hide: () => void;
  setInteractive: (interactive: boolean) => void;
}

export const createTooltipHelpers = (
  tooltip: HTMLDivElement,
  onNavigate?: (run: ExtendedRun) => void,
  onPrefetch?: (run: ExtendedRun) => void,
): TooltipHelpers => {
  tooltip.style.position = "absolute";
  tooltip.style.left = "0";
  tooltip.style.top = "0";
  tooltip.style.display = "none";
  tooltip.style.pointerEvents = "none";
  tooltip.style.willChange = "transform";
  tooltip.style.background = "white";
  tooltip.style.border = "none";
  tooltip.style.borderRadius = "4px";
  tooltip.style.padding = "10px 12px";
  tooltip.style.fontSize = "12px";
  tooltip.style.maxWidth = "220px";
  tooltip.style.minWidth = "160px";
  tooltip.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
  tooltip.innerHTML = "";

  let currentRun: ExtendedRun | null = null;
  let prefetchedRunId: string | null = null;

  tooltip.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-navigate]") && currentRun && onNavigate) {
      onNavigate(currentRun);
    }
  });

  return {
    position(x, y, containerWidth, containerHeight) {
      tooltip.style.display = "block";

      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;

      const goLeft = x + OFFSET_X + tw > containerWidth;
      const goBelow = y - OFFSET_Y - th < 0;

      const rawLeft = goLeft ? x - OFFSET_X - tw : x + OFFSET_X;
      const rawTop = goBelow ? y + OFFSET_Y : y - OFFSET_Y - th;

      // Clamp to container bounds
      const left = Math.max(0, Math.min(rawLeft, containerWidth - tw));
      const top = Math.max(0, Math.min(rawTop, containerHeight - th));

      const r = "8px";
      tooltip.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    },

    updateContent(run, point) {
      currentRun = run;
      const isInteractive = tooltip.style.pointerEvents === "auto";

      tooltip.innerHTML = `
        <ul class="list-disc m-0 pl-4 flex flex-col gap-1 text-black">
          <li><strong>Year:</strong> ${point.year}</li>
          <li><strong>Value:</strong> ${formatNumber(point.value)}</li>
          <li><strong>Model:</strong> ${run.modelName}</li>
          <li><strong>Scenario:</strong> ${run.scenarioName}</li>
        </ul>
        ${
          isInteractive
            ? `
          <button
            data-navigate
            class="mt-2 inline-flex max-w-[140px] w-full items-center justify-center gap-0 rounded-md border-1 border-primary bg-primary-foreground text-primary px-3 py-1.5 text-xs font-bold cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground hover:gap-1"
          >
           See Scenario details
          </button>
        `
            : ""
        }
      `;

      if (isInteractive && onPrefetch && run.runId !== prefetchedRunId) {
        prefetchedRunId = run.runId;
        onPrefetch(run);
      }
    },

    hide() {
      tooltip.style.display = "none";
    },

    setInteractive(interactive) {
      tooltip.style.pointerEvents = interactive ? "auto" : "none";
    },
  };
};
