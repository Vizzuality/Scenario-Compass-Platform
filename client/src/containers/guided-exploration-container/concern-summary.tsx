interface ConcernSummaryProps {
  high: number;
  medium: number;
  none: number;
  unvetted: number;
}

export function ConcernSummary({ high, medium, none, unvetted }: ConcernSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {high > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E33021]" />
            <span className="text-xs font-semibold text-[#E33021]">{high}</span>
            <span className="text-xs">High</span>
          </div>
        )}
        {medium > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ED8936]" />
            <span className="text-xs font-semibold text-[#ED8936]">{medium}</span>
            <span className="text-xs">Medium</span>
          </div>
        )}
        {none > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#4EAD60]" />
            <span className="text-xs font-semibold text-[#4EAD60]">{none}</span>
            <span className="text-xs">None</span>
          </div>
        )}
        {unvetted > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#9CA3AF]" />
            <span className="text-xs font-semibold">{unvetted}</span>
            <span className="text-xs">Unvetted</span>
          </div>
        )}
      </div>
    </div>
  );
}
