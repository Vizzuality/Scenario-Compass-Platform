import { render, RenderOptions } from "@testing-library/react";
import { withNuqsTestingAdapter, UrlUpdateEvent } from "nuqs/adapters/testing";

interface NuqsRenderOptions extends Omit<RenderOptions, "wrapper"> {
  searchParams?: string;
  onUrlUpdate?: (event: UrlUpdateEvent) => void;
}

export const renderWithNuqs = (component: React.ReactElement, options?: NuqsRenderOptions) => {
  const { searchParams, onUrlUpdate, ...renderOptions } = options || {};

  return render(component, {
    ...renderOptions,
    wrapper: withNuqsTestingAdapter({
      searchParams,
      onUrlUpdate,
    }),
  });
};

export const createUrlWithParams = (params: Record<string, string | number>) => {
  const stringifyParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );
  const searchParams = new URLSearchParams(stringifyParams);
  return `?${searchParams.toString()}`;
};
