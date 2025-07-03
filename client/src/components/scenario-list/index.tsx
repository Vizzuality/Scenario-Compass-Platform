// The purpose of this file is to show how to integrate the Index client with react-query. Feel free to delete it if you don't need it.

"use client";

import API from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

import queryKeys from "@/lib/query-keys";

const scenariosQueryOptions = queryOptions({
  ...queryKeys.scenarios.list(),
  enabled: API.isAuthenticated(),
});

export default function ScenarioList() {
  const { data: scenarios, isFetching, isError } = useQuery(scenariosQueryOptions);

  if (isError) return <div>There was an error fetching scenarios</div>;

  if (isFetching) return <div>Loading scenarios...</div>;

  if (!isFetching && !scenarios?.length) return <div>No scenarios found.</div>;

  return (
    <div className="flex flex-col gap-2">
      {scenarios?.map((scenario) => (
        <div key={scenario.id} className="border-b p-4">
          <h2 className="text-xl font-bold">{scenario.name}</h2>
          <p>{scenario.created_at}</p>
          <p className="text-sm text-gray-500">ID: {scenario.id}</p>
        </div>
      ))}
    </div>
  );
}
