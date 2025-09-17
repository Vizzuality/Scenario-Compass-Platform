import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import { PlotContainer } from "@/components/plots/components/plot-container";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";
import React from "react";

type EnumerableDataType<T = unknown, K extends string = string> = {
  isLoading: boolean;
  isError: boolean;
} & {
  [P in K]: T[] | undefined;
};

interface Props<T, K extends string> {
  data: EnumerableDataType<T, K>;
  fieldName: K;
  children: (items: T[]) => React.ReactNode;
}

export const PlotStateHandler = <T, K extends string>({
  data,
  fieldName,
  children,
}: Props<T, K>) => {
  if (data.isLoading) {
    return (
      <PlotContainer>
        <LoadingDots />
      </PlotContainer>
    );
  }

  if (data.isError) {
    return (
      <PlotContainer>
        <DataFetchError />
      </PlotContainer>
    );
  }

  const items = data[fieldName] || [];

  if (items.length === 0) {
    return (
      <PlotContainer>
        <div className="-mt-10 px-4 text-center">
          <Image
            src={notFoundImage}
            alt="No results"
            width={160}
            height={128}
            className="mx-auto"
          />
          <p className="font-bold">No results available</p>
          <p className="leading-5 text-stone-600">
            There are no runs available for the selected combination of parameters. Try adjusting
            the filters to see results.
          </p>
        </div>
      </PlotContainer>
    );
  }

  return (
    <PlotContainer>
      <div className="absolute inset-0">{children(items)}</div>
    </PlotContainer>
  );
};
