import React from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomOut: boolean;
}

export const ZoomControls: React.FC<Props> = ({ onZoomIn, onZoomOut, onReset, canZoomOut }) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
      <button
        onClick={onZoomIn}
        className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
        title="Zoom in"
      >
        <ZoomIn />
      </button>
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
        title="Zoom out"
      >
        <ZoomOut />
      </button>
      <button
        onClick={onReset}
        disabled={!canZoomOut}
        className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
        title="Reset zoom"
      >
        <RotateCcw />
      </button>
    </div>
  );
};
