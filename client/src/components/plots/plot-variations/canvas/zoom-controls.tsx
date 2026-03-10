import React from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomOut: boolean;
}

export const ZoomControls: React.FC<Props> = ({ onZoomIn, onZoomOut, onReset, canZoomOut }) => (
  <div className="absolute top-2 left-14 z-10 flex flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
    <button
      onClick={onZoomIn}
      className="hover:bg-accent flex h-9 w-9 items-center justify-center p-1 text-gray-600 transition-colors hover:text-gray-900"
      title="Zoom in"
    >
      <ZoomIn size={16} />
    </button>
    <button
      onClick={onZoomOut}
      disabled={!canZoomOut}
      className="hover:bg-accent flex h-9 w-9 items-center justify-center p-1 text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      title="Zoom out"
    >
      <ZoomOut size={16} />
    </button>
    <button
      onClick={onReset}
      disabled={!canZoomOut}
      className="hover:bg-accent flex h-9 w-9 items-center justify-center p-1 text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      title="Reset zoom"
    >
      <RotateCcw size={16} />
    </button>
  </div>
);
