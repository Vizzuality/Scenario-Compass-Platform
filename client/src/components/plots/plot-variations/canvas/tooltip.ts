import { ExtendedRun } from "@/types/data/run";
import { formatNumber } from "@/utils/plots/format-functions";

/**
 * Creates tooltip positioning and content helpers bound to specific DOM elements.
 * Returned functions are used inside event handlers — they mutate the tooltip
 * element directly (no React state) for zero-overhead updates during mousemove.
 */
export const createTooltipHelpers = (tooltip: HTMLDivElement, container: HTMLDivElement) => {
  const position = (mouseX: number, mouseY: number) => {
    tooltip.style.display = "block";
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;

    let left = mouseX + 15;
    let top = mouseY - th / 2;

    if (left + tw > cw) left = mouseX - tw - 15;
    if (top < 0) top = 10;
    if (top + th > ch) top = ch - th - 10;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const updateContent = (run: ExtendedRun, point: { year: number; value: number }) => {
    tooltip.innerHTML = `
      <ul class="list-disc m-0 pl-5 flex flex-col gap-1 text-black">
        <li><strong>Year:</strong> ${point.year}</li>
        <li><strong>Value:</strong> <span>${formatNumber(point.value)}</span></li>
        <li><strong>Model:</strong> <span>${run.modelName}</span></li>
        <li><strong>Scenario:</strong> <span>${run.scenarioName}</span></li>
      </ul>
    `;
  };

  const hide = () => {
    tooltip.style.display = "none";
  };

  return { position, updateContent, hide };
};

export type TooltipHelpers = ReturnType<typeof createTooltipHelpers>;
