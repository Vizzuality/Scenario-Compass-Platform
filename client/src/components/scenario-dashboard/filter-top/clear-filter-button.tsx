"use client";

import { useQueryStates, parseAsString } from "nuqs";
import { SEARCH_PARAMS } from "@/lib/constants";

export default function ClearFilterButton() {
  const [, setQuery] = useQueryStates({
    [SEARCH_PARAMS.YEAR]: parseAsString,
    [SEARCH_PARAMS.START_YEAR]: parseAsString,
    [SEARCH_PARAMS.END_YEAR]: parseAsString,
    [SEARCH_PARAMS.GEOGRAPHY]: parseAsString,
  });

  const handleClearAll = () => {
    setQuery({
      [SEARCH_PARAMS.YEAR]: null,
      [SEARCH_PARAMS.START_YEAR]: null,
      [SEARCH_PARAMS.END_YEAR]: null,
      [SEARCH_PARAMS.GEOGRAPHY]: null,
    });
  };

  return (
    <button
      onClick={handleClearAll}
      className="text-beige-light text-sm leading-5 text-nowrap underline underline-offset-2"
      aria-label="Clear all filters"
      type="button"
    >
      Clear all
    </button>
  );
}
