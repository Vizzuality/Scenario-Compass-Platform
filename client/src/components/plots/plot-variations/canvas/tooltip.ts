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
  onClose?: () => void,
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
    if (target.closest("[data-close]")) {
      tooltip.style.display = "none";
      tooltip.style.pointerEvents = "none";
      onClose?.();
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

      const left = Math.round(Math.max(0, Math.min(rawLeft, containerWidth - tw)));
      const top = Math.round(Math.max(0, Math.min(rawTop, containerHeight - th)));

      tooltip.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    },

    updateContent(run, point) {
      currentRun = run;
      const isInteractive = tooltip.style.pointerEvents === "auto";

      tooltip.innerHTML = `
        <div style="position: relative;">
          ${
            isInteractive
              ? `
            <button
              data-close
              class="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              style="background: none; border: none; padding: 0;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="M6 6 18 18"/>
              </svg>
            </button>
          `
              : ""
          }
          <ul class="list-disc m-0 pl-4 flex flex-col gap-1 text-black" style="${isInteractive ? "padding-right: 20px;" : ""}">
            <li><strong>Value:</strong> ${formatNumber(point.value)} ${run.unit}</li>
            <li><strong>Year:</strong> ${point.year}</li>
            <li><strong>Model:</strong> ${run.modelName}</li>
            <li><strong>Scenario:</strong> ${run.scenarioName}</li>
          </ul>
          ${
            isInteractive
              ? `
            <button
              data-navigate
              class="mt-2 inline-flex max-w-[160px] w-full items-center justify-center gap-1 rounded-md border-1 border-primary bg-primary-foreground text-primary px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              See Scenario details
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 7h10v10"/>
                <path d="M7 17 17 7"/>
              </svg>
            </button>
          `
              : ""
          }
        </div>
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
