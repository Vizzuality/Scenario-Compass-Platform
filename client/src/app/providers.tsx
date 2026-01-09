"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";

export const queryClient = new QueryClient();

export const ClientProviders = ({ children }: PropsWithChildren) => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </Provider>
  );
};
