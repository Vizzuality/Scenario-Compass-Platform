import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";
import React from "react";

interface Props<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  children: (items: T[]) => React.ReactNode;
}

const centered = "relative flex h-full w-full items-center justify-center";

export const PlotStateHandler = <T,>({ items, isLoading, isError, children }: Props<T>) => {
  if (isLoading) {
    return (
      <div className={centered}>
        <LoadingDots />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={centered}>
        <DataFetchError />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={centered}>
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
      </div>
    );
  }

  return <div className="relative h-full w-full">{children(items)}</div>;
};
