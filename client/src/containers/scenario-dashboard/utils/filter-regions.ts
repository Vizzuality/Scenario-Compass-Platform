import { Region } from "@iiasa/ixmp4-ts";

const REGION_FILTERS = ["(R5)", "(R9)", "(R10)"] as const;

export type TransformedRegion = Pick<Region, "hierarchy" | "name"> & { id: string };

export const filterRegions = (regions: Region[]): TransformedRegion[] => {
  return regions
    .filter((region) =>
      REGION_FILTERS.some((pattern) => region.name.includes(pattern) || region.name === "World"),
    )
    .map((region) => {
      return {
        name: region.name,
        hierarchy: region.hierarchy,
        id: region.id.toString(),
      };
    });
};
